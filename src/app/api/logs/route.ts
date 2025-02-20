import { NextResponse } from 'next/server';

// Entities
import { UserRoles } from '@/domain/entities/user';

// Use Cases
import { getPaginatedLogsUseCase } from '@/use-cases/ApiLogUseCases';

// Adapters
import { Session, withAuthorization } from '@/adapters/withAuthorization';
import { Pagination, withPagination } from '@/adapters/withPagination';

async function getLogsHandler(request: Request, user: Session, pagination: Pagination) {
    var { search, limit, skip } = pagination;

    const [logs, totalCount] = await getPaginatedLogsUseCase.execute({
        search,
        skip,
        limit,
    });

    return NextResponse.json({
        data: logs,
        pagination: {
            totalPages: Math.ceil(totalCount / limit),
        },
        status: 200,
    });
}

export const GET = withAuthorization([UserRoles.ADMIN], async (request, user) => {
    return withPagination((req, pagination) => getLogsHandler(req, user, pagination))(request);
});
