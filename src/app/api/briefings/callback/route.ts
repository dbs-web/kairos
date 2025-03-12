// Entities
import { withExternalRequestValidation } from '@/adapters/withExternalRequestValidation';
import { Status } from '@/domain/entities/status';

// Use Cases
import { createApiResponseUseCase } from '@/use-cases/ApiLogUseCases';
import { updateBriefingUseCase } from '@/use-cases/BriefingUseCases';
import { DifyStatus } from '@prisma/client';

interface CallbackBody {
    briefingId?: number;
    sources?: string;
    text?: string;
}

const route = '/api/briefings/callback';

export const POST = withExternalRequestValidation(async (request: Request) => {
    const body = await request.json();

    try {
        const { briefingId, sources, text }: CallbackBody = body;

        if (!briefingId) {
            return createApiResponseUseCase.USER_NOT_ALLOWED({
                route,
                body: body,
                message: 'You should provide the briefingId',
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

        return createApiResponseUseCase.SUCCESS({
            route,
            body: body,
            message: 'Briefing atualizado',
        });
    } catch (error) {
        return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
            route,
            body: body,
            message: 'Internal Server Error',
            error: `Internal server error: ${error instanceof Error ? error.message : error}`,
        });
    }
});
