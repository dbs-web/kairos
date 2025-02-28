import { NextResponse } from 'next/server';

// Entities
import { UserRoles } from '@/domain/entities/user';

// Use Cases
import { createVideoUseCase, getPaginatedVideosUseCase } from '@/use-cases/VideoUseCases';
import { createApiResponseUseCase } from '@/use-cases/ApiLogUseCases';

// Adapters
import { Session, withAuthorization } from '@/adapters/withAuthorization';
import { Pagination, withPagination } from '@/adapters/withPagination';
import { getUsersUseCase } from '@/use-cases/UserUseCases';
import { generateVideoUseCase } from '@/use-cases/HeyGen';

const route = '/api/videos';

async function getVideosHandler(request: Request, user: Session, pagination: Pagination) {
    const { page, skip, limit } = pagination;

    const [videos, totalCount] = await getPaginatedVideosUseCase.execute({
        userId: user.id,
        skip,
        limit,
    });

    return NextResponse.json({
        data: videos,
        pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        },
        currentPage: page,
        status: 200,
    });
}

export const GET = withAuthorization([UserRoles.USER], async (request, user) => {
    return withPagination((req, pagination) => getVideosHandler(req, user, pagination))(request);
});

export const POST = withAuthorization([UserRoles.USER], async (request, { id: userId }) => {
    const body = await request.json();
    try {
        const { avatar, title, text, width, height } = body;

        if (!avatar || !title || !text || !width || !height) {
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                message: 'You should provide avatar,title, text, width and height',
                body,
            });
        }

        const { voiceId } = await getUsersUseCase.byId(userId);
        if (!voiceId) {
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                message: 'User voiceID is not set',
                body,
                error: `Set the user's voice id before generating videos.`,
            });
        }

        const heygenVideoId = await generateVideoUseCase.execute({
            avatarId: avatar,
            text,
            voiceId,
            width,
            height,
        });

        await createVideoUseCase.execute({
            userId,
            title,
            legenda: '',
            transcription: text,
            heygenVideoId,
            width,
            height,
        });

        return createApiResponseUseCase.SUCCESS({
            route,
            message: 'Video criado com sucesso!',
            body,
        });
    } catch (error) {
        return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
            route,
            message: 'Error while creating new video',
            body,
            error: `${error instanceof Error ? error.message : error}`,
        });
    }
});
