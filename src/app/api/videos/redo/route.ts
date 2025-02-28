// Entities
import { UserRoles } from '@/domain/entities/user';

// Use Cases
import { getUsersUseCase } from '@/use-cases/UserUseCases';
import { getVideosUseCase, updateVideoUseCase } from '@/use-cases/VideoUseCases';
import { createApiResponseUseCase } from '@/use-cases/ApiLogUseCases';
import { generateVideoUseCase } from '@/use-cases/HeyGen';

// Adapters
import { withAuthorization } from '@/adapters/withAuthorization';
import { HeyGenStatus } from '@/domain/entities/video';

const route = '/api/videos/redo';

interface PostBody {
    avatar: string | undefined;
    videoId: number | undefined;
    width: number | undefined;
    height: number | undefined;
    transcription: string | undefined;
}

export const POST = withAuthorization([UserRoles.USER], async (request, { id: userId }) => {
    const body = await request.json();

    try {
        const { videoId, avatar, width, height, transcription }: PostBody = body;

        if (!videoId || !avatar || !transcription || !width || !height) {
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                body,
                error: 'You need to provide avatar, videoId, transcription, widht and height fields.',
            });
        }

        const user = await getUsersUseCase.byId(userId);

        const userVoiceId = user.voiceId;
        if (!userVoiceId) {
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                body,
                error: 'User voiceId is not set, please, contact systems admins.',
            });
        }

        const heygenVideoId = await generateVideoUseCase.execute({
            avatarId: avatar,
            text: transcription,
            voiceId: userVoiceId,
            width,
            height,
        });

        await updateVideoUseCase.execute({
            id: videoId,
            data: {
                heygenVideoId,
                heygenStatus: HeyGenStatus.PROCESSING,
                width,
                height,
                transcription,
            },
        });

        return createApiResponseUseCase.SUCCESS({
            route,
            body,
            message: 'Refação de vídeo realizada com sucesso!',
        });
    } catch (error) {
        return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
            route,
            body,
            error: `${error instanceof Error ? error.message : error}`,
        });
    }
});
