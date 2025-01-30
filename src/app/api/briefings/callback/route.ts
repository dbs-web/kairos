import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { validateExternalRequest, createApiResponse } from '@/lib/api';
import { insertRedisData } from '@/lib/redis';

export async function POST(request: Request) {
    const route = '/api/briefings/callback';
    const headersList = await headers();
    const body = await request.json();

    try {
        const valid = await validateExternalRequest(headersList);

        if (!valid) {
            return createApiResponse({
                route,
                body: body,
                status: 401,
                message: 'Not Authorized.',
                error: 'Unauthorized request',
            });
        }

        const { briefingId, text } = body;

        if (!briefingId || !text) {
            return createApiResponse({
                route,
                body: body,
                status: 405,
                message: 'Dados incompletos.',
                error: 'Missing briefingId or text',
            });
        }

        const briefing = await prisma.briefing.update({
            where: {
                id: briefingId,
            },
            data: {
                text,
                status: 'EM_ANALISE',
            },
        });

        await insertRedisData({
            userId: briefing.userId,
            dataType: 'briefing',
        });

        return createApiResponse({
            route,
            body: body,
            status: 200,
            message: 'Briefing atualizado',
        });
    } catch (error) {
        return createApiResponse({
            route,
            body: body,
            status: 500,
            message: 'Internal Server Error',
            error: `Internal server error: ${error instanceof Error ? error.message : error}`,
        });
    }
}
