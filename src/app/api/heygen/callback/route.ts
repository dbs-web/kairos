// Entities
import { HeyGenAvatarVideoStatus, HeyGenStatus } from '@/domain/entities/video';

// Use Cases
import { createApiResponseUseCase } from '@/use-cases/ApiLogUseCases';
import {
    addVideoFailedStatusUseCase,
    addVideoSubtitleUseCase,
    addVideoUrlUseCase,
} from '@/use-cases/VideoUseCases';
import { createSubtitlesUseCase } from '@/use-cases/DifyUseCases';

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

        if (event_type === HeyGenAvatarVideoStatus.SUCCESS) {
            // Update video url
            const video = await addVideoUrlUseCase.execute({
                heygenVideoId: video_id,
                url,
                heygenStatus: HeyGenStatus.SUCCESS,
            });

            // Create subtitles for video
            const subtitle = await createSubtitlesUseCase.execute({
                transcription: video.transcription as string,
            });

            await addVideoSubtitleUseCase.execute({
                id: video.id,
                subtitle,
            });

            return createApiResponseUseCase.SUCCESS({
                route,
                body,
                message: 'Video generataded successfully!',
            });
        } else if (event_type === HeyGenAvatarVideoStatus.FAIL) {
            await addVideoFailedStatusUseCase.execute(video_id);

            return createApiResponseUseCase.SUCCESS({
                route,
                body,
                message: 'Video generation failed!',
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
