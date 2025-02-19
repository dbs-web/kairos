import { NextResponse } from 'next/server';

import { getPaginationParams } from '@/lib/api';

// Entities
import { UserRoles } from '@/domain/entities/user';

// Use Cases
import { getPaginatedLogsUseCase } from '@/use-cases/ApiLogUseCases';

// Adapters
import { withAuthorization } from '@/adapters/withAuthorization';

export const GET = withAuthorization([UserRoles.ADMIN], async (request) => {
    var { search, limit, skip } = getPaginationParams(request);

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
});
