import { NextResponse } from 'next/server';

// Entities
import { UserRoles } from '@/domain/entities/user';

// Use Cases
import { createManyNewsUseCase, getPaginatedNewsUseCase } from '@/use-cases/NewsUseCases';

// Adapters
import { withAuthorization, Session } from '@/adapters/withAuthorization';
import { withExternalRequestValidation } from '@/adapters/withExternalRequestValidation';
import { withPagination, type Pagination } from '@/adapters/withPagination';

export const POST = withExternalRequestValidation(async (request: Request) => {
    const { data } = await request.json();

    if (!Array.isArray(data) || data.length === 0) {
        return NextResponse.json({
            message: 'Nenhum dado válido fornecido.',
            status: 400,
        });
    }

    await createManyNewsUseCase.execute({ newsDataArr: data });

    return NextResponse.json({ message: 'News created successfully!' });
});

async function getNewsHandler(request: Request, user: Session, pagination: Pagination) {
    const userId = user.id;

    const { search, status, page, limit, skip } = pagination;

    try {
        const [news, totalCount] = await getPaginatedNewsUseCase.execute({
            userId,
            statuses: [status],
            search,
            skip,
            limit,
        });

        return NextResponse.json({
            data: news,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                message: 'Erro ao buscar noticias',
                error: error instanceof Error ? error.message : error,
            },
            { status: 500 },
        );
    }
}

export const GET = withAuthorization([UserRoles.USER], async (request, user) => {
    return withPagination((req, pagination) => getNewsHandler(req, user, pagination))(request);
});
