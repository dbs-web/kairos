// Entities
import { HeyGenStatus } from '@/domain/entities/video';

// Use Cases
import { createApiResponseUseCase } from '@/use-cases/ApiLogUseCases';
import { addVideoFailedStatusUseCase, addVideoUrlUseCase } from '@/use-cases/VideoUseCases';

import { PollingManager } from '@/infrastructure/polling/PollingManager';

// Adapters
import HeyGenAdapter from '@/adapters/HeygenAdapter';

const heygenAdapter = new HeyGenAdapter();

export async function POST(request: Request) {
    const body = await request.json();
    const route = '/api/heygen/callback';

    try {
        // if (!heygenAdapter.checkCallbackRequest(request))
        //     return createApiResponseUseCase.BAD_REQUEST({
        //         route,
        //         body,
        //         message: 'Failed on heygen check',
        //         error: 'Invalid signature',
        //     });

        const { event_type, event_data } = body;

        if (!event_type || !event_data) {
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                body,
                message: 'Invalid payload',
                error: 'Missing event_type or event_data',
            });
        }

        const { video_id, url, msg } = event_data;

        if (event_type === 'avatar_video.success') {
            const video = await addVideoUrlUseCase.execute({
                id: video_id,
                url,
                heygenStatus: HeyGenStatus.SUCCESS,
            });

            if (!video) {
                return createApiResponseUseCase.BAD_REQUEST({
                    route,
                    body,
                    message: 'Video not found!',
                });
            }

            return createApiResponseUseCase.SUCCESS({
                route,
                body,
                message: 'Video updated successfully',
            });
        } else if (event_type === 'avatar_video.fail') {
            const video = await addVideoFailedStatusUseCase.execute(video_id);

            if (!video) {
                return createApiResponseUseCase.BAD_REQUEST({
                    route,
                    body,
                    message: 'Video not found!',
                });
            }

            const pollingManager = new PollingManager();

            await pollingManager.insertData({
                userId: video.userId,
                dataType: 'video',
            });

            return createApiResponseUseCase.SUCCESS({
                route,
                body,
                message: 'Video update failed',
                error: msg,
            });
        } else {
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                body,
                message: 'Unhandled event type',
                error: 'Event type is not supported',
            });
        }
    } catch (error) {
        return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
            route,
            body,
            message: 'Internal Server Error',
            error: `Internal server error: ${error instanceof Error ? error.message : error}`,
        });
    }
}
