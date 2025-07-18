import { NextResponse } from 'next/server';

// Entities
import { UserRoles } from '@/domain/entities/user';

// Use Cases
import { createManyNewsUseCase, getPaginatedNewsUseCase } from '@/use-cases/NewsUseCases';

// Adapters
import { withAuthorization, Session } from '@/adapters/withAuthorization';
import { withExternalRequestValidation } from '@/adapters/withExternalRequestValidation';
import { withPagination, type Pagination } from '@/adapters/withPagination';
import { Status } from '@/domain/entities/status';

export const POST = withExternalRequestValidation(async (request: Request) => {
    console.log('=== POST /api/news - Request received ===');
    try {
        const body = await request.json();
        console.log('=== POST /api/news - Body parsed:', JSON.stringify(body, null, 2));
        const { data, userId } = body;

    if (!Array.isArray(data) || data.length === 0) {
        return NextResponse.json({
            message: 'Nenhum dado válido fornecido.',
            status: 400,
        });
    }

    if (!userId) {
        return NextResponse.json({
            message: 'UserId é obrigatório.',
            status: 400,
        });
    }

    // Add Status EM_ANALISE to each news
    data.forEach((news) => {
        news.status = Status.EM_ANALISE;
    });

    const createdNews = await createManyNewsUseCase.execute({ newsDataArr: data, userId });

        return NextResponse.json({
            message: 'News created successfully!',
            created: createdNews.length,
            duplicatesFiltered: data.length - createdNews.length
        });
    } catch (error) {
        console.error('=== POST /api/news - Error:', error);
        return NextResponse.json({
            message: 'Erro interno do servidor',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
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
