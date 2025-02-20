import { Status } from '@/domain/entities/status';

// Entities
import { UserRoles } from '@/domain/entities/user';

// Use Cases
import { createApiResponseUseCase } from '@/use-cases/ApiLogUseCases';
import {
    createBriefingsUseCase,
    deleteBriefingUseCase,
    getPaginatedBriefingsUseCase,
    updateBriefingUseCase,
} from '@/use-cases/BriefingUseCases';
import { customBriefingRequestUseCase } from '@/use-cases/DifyUseCases';

// Adapters
import { Session, withAuthorization } from '@/adapters/withAuthorization';
import { Pagination, withPagination } from '@/adapters/withPagination';
import { IBriefing } from '@/domain/entities/briefing';
import GetUserDifyAgentUseCase from '@/use-cases/UserUseCases/GetUserDifyAgentUseCase';
import { getUserDifyAgentUseCase } from '@/use-cases/UserUseCases';

const route = '/api/briefings';

async function getBriefingsHandler(request: Request, user: Session, pagination: Pagination) {
    const { searchParams } = new URL(request.url);

    var { search, status, limit, skip } = pagination;

    const statuses =
        status === Status.EM_ANALISE ? [Status.EM_ANALISE, Status.EM_PRODUCAO] : [status];

    try {
        const [briefings, totalCount] = await getPaginatedBriefingsUseCase.execute({
            userId: user.id,
            statuses,
            search,
            skip,
            limit,
        });

        return createApiResponseUseCase.SUCCESS({
            route,
            body: { searchParams: searchParams.toString() },
            message: 'Briefings retrieved successfully',
            data: { data: briefings, pagination: { totalPages: Math.ceil(totalCount / limit) } },
        });
    } catch (error) {
        return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
            route,
            body: { searchParams: searchParams.toString() },
            message: 'Failed to retrieve briefings',
            error: `Internal server error: ${error instanceof Error ? error.message : error}`,
        });
    }
}

export const GET = withAuthorization([UserRoles.USER], async (request, user) => {
    return withPagination((req, pagination) => getBriefingsHandler(req, user, pagination))(request);
});

export const POST = withAuthorization([UserRoles.USER, UserRoles.ADMIN], async (request, user) => {
    const body = await request.json();

    const { title, prompt }: { title: string; prompt: string } = body;

    if (!title || !prompt) {
        return createApiResponseUseCase.BAD_REQUEST({
            route,
            body,
            message: 'Dados incompletos.',
            error: 'Missing required fields',
        });
    }

    const difyAgentToken = await getUserDifyAgentUseCase.execute({ userId: user.id });

    if (!difyAgentToken) {
        return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
            route,
            body: body,
            message: 'Failed to create briefing',
            error: 'Internal server error: failed to get Dify agent token',
        });
    }

    try {
        const createdBriefing = await createBriefingsUseCase.fromPrompt({
            userId: user.id,
            title,
        });

        if (!createdBriefing) {
            return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
                route,
                body: body,
                message: 'Failed to create briefing',
                error: 'Internal server error: failed to create briefing',
            });
        }

        const res = await customBriefingRequestUseCase.execute({
            difyAgentToken: difyAgentToken,
            briefing: createdBriefing,
            prompt,
        });

        if (res.ok)
            return createApiResponseUseCase.SUCCESS({
                route,
                body: body,
                message: 'Briefing created successfully',
                data: createdBriefing,
            });

        return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
            route,
            body: body,
            message: 'Failed to create briefing',
            error: `Internal server error: ${res.statusText}`,
        });
    } catch (error) {
        console.log(`${error instanceof Error ? error.message : error}`);
        return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
            route,
            body: body,
            message: 'Failed to create briefing',
            error: `Internal server error: ${error instanceof Error ? error.message : error}`,
        });
    }
});

export const PUT = withAuthorization([UserRoles.USER], async (request, user) => {
    const body = await request.json();

    const { id, text, status } = body;

    if (!id || !text) {
        return createApiResponseUseCase.BAD_REQUEST({
            route,
            body,
            message: 'Dados incompletos.',
            error: 'Missing required fields',
        });
    }

    try {
        const updatedBriefing = updateBriefingUseCase.execute({
            id,
            userId: user.id,
            data: {
                text,
                status,
            },
        });

        if (!updatedBriefing) {
            return createApiResponseUseCase.USER_NOT_ALLOWED({
                route,
                body,
                message: 'Acesso negado.',
                error: 'Unauthorized access to briefing',
            });
        }

        return createApiResponseUseCase.SUCCESS({
            route,
            body: body,
            message: 'Briefing updated successfully',
            data: updatedBriefing,
        });
    } catch (error) {
        return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
            route,
            body: body,
            message: 'Failed to update briefing',
            error: `Internal server error: ${error instanceof Error ? error.message : error}`,
        });
    }
});

export const DELETE = withAuthorization(
    [UserRoles.USER, UserRoles.ADMIN],
    async (request, user) => {
        const body = await request.json();

        const { id } = body;
        if (!id) {
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                body,
                message: 'Dados incompletos.',
                error: 'Missing briefing ID',
            });
        }

        try {
            const archivedBriefing = await deleteBriefingUseCase.execute({
                id,
                userId: user.id,
            });

            if (!archivedBriefing) {
                return createApiResponseUseCase.USER_NOT_ALLOWED({
                    route,
                    body,
                    message: 'Acesso negado.',
                    error: 'Unauthorized access to briefing',
                });
            }

            return createApiResponseUseCase.SUCCESS({
                route,
                body,
                message: 'Briefing arquivado com sucesso.',
            });
        } catch (error) {
            return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
                route,
                body: body,
                message: 'Failed to archive briefing',
                error: `Internal server error: ${error instanceof Error ? error.message : error}`,
            });
        }
    },
);
