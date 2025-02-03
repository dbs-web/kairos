import { NextResponse } from 'next/server';
import { createApiResponse, validateExternalRequest } from '@/lib/api';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { insertRedisData } from '@/lib/redis';

const route = '/api/videos/callback';

export async function POST(request: Request) {
    const headersList = await headers();
    const body = await request.json();

    try {
        const valid = await validateExternalRequest(headersList);

        if (!valid) {
            return createApiResponse({
                route,
                body,
                status: 401,
                message: 'Not Authorized.',
                error: 'Unauthorized request',
            });
        }

        const { legenda, video_id } = body;

        if (!legenda) {
            return createApiResponse({
                route,
                body: body,
                status: 405,
                message: 'Dados incompletos.',
                error: 'Missing legenda.',
            });
        }

        const video = await prisma.video.update({
            where: {
                id: video_id,
            },
            data: {
                legenda,
            },
        });

        await insertRedisData({
            userId: video.userId,
            dataType: 'video',
        });

        return createApiResponse({
            route,
            body,
            status: 200,
            message: 'Video update successfull!',
        });
    } catch (error) {
        const message = `${error instanceof Error ? error.message : error}`;
        return createApiResponse({
            route,
            body,
            status: 500,
            message: 'Error while updating video data.',
            error: message,
        });
    }
}
