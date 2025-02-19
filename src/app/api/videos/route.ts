import { NextResponse } from 'next/server';

// Entities
import { UserRoles } from '@/domain/entities/user';

// Use Cases
import { getPaginatedVideosUseCase } from '@/use-cases/VideoUseCases';

// Adapters
import { Session, withAuthorization } from '@/adapters/withAuthorization';
import { Pagination, withPagination } from '@/adapters/withPagination';

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
