// Use Cases
import { createApiResponseUseCase } from '@/use-cases/ApiLogUseCases';
import { addVideoSubtitleUseCase } from '@/use-cases/VideoUseCases';

import { PollingManager } from '@/infrastructure/polling/PollingManager';
import { withExternalRequestValidation } from '@/adapters/withExternalRequestValidation';

const route = '/api/videos/callback';

export const POST = withExternalRequestValidation(async (request: Request) => {
    const body = await request.json();

    try {
        const { legenda, video_id } = body;

        if (!legenda) {
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                body: body,
                message: 'Dados incompletos.',
                error: 'Missing legenda.',
            });
        }

        const video = await addVideoSubtitleUseCase.execute({
            id: video_id,
            subtitle: legenda,
        });

        if (!video) {
            return createApiResponseUseCase.NOT_FOUND({
                route,
                body: body,
                message: 'Video not found',
                error: 'Video not found.',
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
            message: 'Video update successfull!',
        });
    } catch (error) {
        const message = `${error instanceof Error ? error.message : error}`;
        return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
            route,
            body,
            message: 'Error while updating video data.',
            error: message,
        });
    }
});
