import { prisma } from '@/lib/prisma';
import { createApiResponse } from '@/lib/api';
import { insertRedisData } from '@/lib/redis';

const HEYGEN_SECRET = process.env.HEYGEN_SECRET;

function verifySignature(req: Request): boolean {
    return HEYGEN_SECRET == req.headers.get('secret');
}

export async function POST(request: Request) {
    const body = await request.json();
    const route = '/api/heygen/callback';

    try {
        const { event_type, event_data } = body;

        if (!event_type || !event_data) {
            return createApiResponse({
                route,
                body,
                status: 400,
                message: 'Invalid payload',
                error: 'Missing event_type or event_data',
            });
        }

        const { video_id, url, callback_id, msg } = event_data;

        const video = await prisma.video.findUnique({
            where: {
                heygenVideoId: video_id,
            },
        });

        if (!video) {
            return createApiResponse({
                route,
                body,
                status: 404,
                message: 'Video not found',
                error: 'No video found with the provided video_id',
            });
        }

        if (event_type === 'avatar_video.success') {
            await prisma.video.update({
                where: { id: video.id },
                data: {
                    url: url,
                    heygenStatus: 'SUCCESS',
                },
            });

            return createApiResponse({
                route,
                body,
                status: 200,
                message: 'Video updated successfully',
            });
        } else if (event_type === 'avatar_video.fail') {
            const updatedVideo = await prisma.video.update({
                where: { id: video.id },
                data: {
                    heygenStatus: 'FAILED',
                    heygenErrorMsg: msg,
                },
            });

            insertRedisData({
                userId: updatedVideo.userId,
                dataType: 'video',
            });

            return createApiResponse({
                route,
                body,
                status: 200,
                message: 'Video update failed',
                error: msg,
            });
        } else {
            return createApiResponse({
                route,
                body,
                status: 400,
                message: 'Unhandled event type',
                error: 'Event type is not supported',
            });
        }
    } catch (error) {
        return createApiResponse({
            route,
            body,
            status: 500,
            message: 'Internal Server Error',
            error: `Internal server error: ${error instanceof Error ? error.message : error}`,
        });
    }
}
