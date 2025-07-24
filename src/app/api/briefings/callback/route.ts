// Entities
import { withExternalRequestValidation } from '@/adapters/withExternalRequestValidation';
import { Status } from '@/domain/entities/status';

// Use Cases
import { createApiResponseUseCase } from '@/use-cases/ApiLogUseCases';
import { updateBriefingUseCase } from '@/use-cases/BriefingUseCases';
import { getBriefingUseCase } from '@/use-cases/BriefingUseCases';
import { DifyStatus } from '@prisma/client';

interface CallbackBody {
    briefingId?: number;
    briefingid?: number; // Support lowercase version
    sources?: string;
    text?: string;
    texto?: string; // Support Portuguese version
    cliente?: string;
    rede_social?: string;
    post_url?: string;
}

const route = '/api/briefings/callback';

import { NextRequest, NextResponse } from 'next/server';
import pollingClient from '@/infrastructure/polling/PollingClientSingleton';

export async function POST(request: NextRequest) {
    try {
        let body = await request.json();

        // Handle array format - take first item
        if (Array.isArray(body) && body.length > 0) {
            body = body[0];
        }

        // Support both field name formats
        const briefingId = body.briefingId || body.briefingid;
        const text = body.text || body.texto;
        const sources = body.sources;

        if (!briefingId) {
            return createApiResponseUseCase.USER_NOT_ALLOWED({
                route,
                body: body,
                message: 'You should provide the briefingId or briefingid',
                error: 'Missing briefingId',
            });
        }

        if (!text && !sources) {
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                body: body,
                message: 'Dados incompletos.',
                error: 'Missing sources or text',
            });
        }

        const updateData: any = {
            status: Status.EM_ANALISE,
            difyStatus: DifyStatus.PRONTO,
            difyMessage: '',
            text,
        };

        if (sources) {
            updateData.sources = sources;
        }

        await updateBriefingUseCase.dangerousUpdate({
            id: briefingId,
            data: updateData,
            poll: true,
        });

        // Get the user ID from the briefing to send notification
        const briefing = await getBriefingUseCase.byId({ id: briefingId });
        if (briefing?.userId) {
            await pollingClient.incrementNotificationCount(briefing.userId.toString(), 'briefings');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Callback error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
