import { NextResponse } from 'next/server';

// Entities
import { UserRoles } from '@/domain/entities/user';
import { Status } from '@/domain/entities/status';

// Use Cases
import {
    createManySuggestionsUseCase,
    getPaginatedSuggestionsUseCase,
    updateSuggestionsStatusUseCase,
} from '@/use-cases/SuggestionUseCases';

// Adapters
import { Session, withAuthorization } from '@/adapters/withAuthorization';
import { withExternalRequestValidation } from '@/adapters/withExternalRequestValidation';
import { Pagination, withPagination } from '@/adapters/withPagination';

export const POST = withExternalRequestValidation(async (request: Request) => {
    console.log('=== POST /api/sugestoes - Request received ===');
    try {
        const body = await request.json();
        console.log('=== POST /api/sugestoes - Body parsed:', JSON.stringify(body, null, 2));
        const { data, userId } = body;
        console.log('=== POST /api/sugestoes - Data extracted ===');

        if (!Array.isArray(data) || data.length === 0) {
            console.log('=== POST /api/sugestoes - Invalid data ===');
            return NextResponse.json({ status: 400, message: 'Dados inválidos' });
        }

        if (!userId) {
            return NextResponse.json({
                message: 'UserId é obrigatório.',
                status: 400,
            });
        }

        console.log('POST /api/sugestoes - Received data:', JSON.stringify(data, null, 2));
        const createdSuggestions = await createManySuggestionsUseCase.execute({ suggestionsArr: data, userId });
        console.log('=== POST /api/sugestoes - Success ===');

        return NextResponse.json({
            message: 'Suggestions created successfully!',
            created: createdSuggestions.length,
            duplicatesFiltered: data.length - createdSuggestions.length
        });
    } catch (e) {
        console.error('=== POST /api/sugestoes - Error details ===', e);
        return NextResponse.json({ status: 500, message: 'Erro ao criar sugestões', error: e });
    }
});

async function getSuggestionsHandler(request: Request, user: Session, pagination: Pagination) {
    const userId = user.id;
    const { search, page, status, skip, limit } = pagination;
    try {
        const [suggestions, totalCount] = await getPaginatedSuggestionsUseCase.execute({
            userId,
            statuses: [status],
            search,
            skip,
            limit,
        });

        return NextResponse.json({
            data: suggestions,
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
                status: 500,
                message: 'Erro ao buscar sugestões',
                error: error instanceof Error ? error.message : 'Erro desconhecido',
            },
            { status: 500 },
        );
    }
}

export const DELETE = withAuthorization(
    [UserRoles.USER, UserRoles.ADMIN],
    async (request, user) => {
        const userId = user.id;
        try {
            const { ids } = await request.json();

            if (!Array.isArray(ids) || ids.length === 0) {
                return NextResponse.json({ status: 400, message: 'Dados inválidos' });
            }

            await updateSuggestionsStatusUseCase.execute({
                suggestions: ids,
                userId,
                status: Status.ARQUIVADO,
            });

            return NextResponse.json({ message: 'Suggestions archived successfully!' });
        } catch (e) {
            return NextResponse.json({
                status: 500,
                message: 'Erro ao arquivar sugestões',
                error: e,
            });
        }
    },
);

export const GET = withAuthorization([UserRoles.USER], async (request, user) => {
    return withPagination((req, pagination) => getSuggestionsHandler(req, user, pagination))(
        request,
    );
});
