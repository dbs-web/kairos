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
import { checkContentUseCase } from '@/use-cases/DifyUseCases';

// Services
import { sendToN8nWebhook } from '@/services/client/webhook/sendToN8nWebhook';

// Adapters
import { Session, withAuthorization } from '@/adapters/withAuthorization';
import { Pagination, withPagination } from '@/adapters/withPagination';
import { IBriefing } from '@/domain/entities/briefing';

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
            log: false,
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

    try {
        // Checks whether the text complies with policy standards
        await checkContentUseCase.execute(prompt);

        const createdBriefing = await createBriefingsUseCase.fromPrompt({
            userId: user.id,
            title,
        });

        // Send to N8N webhook for content creation
        const webhookResult = await sendToN8nWebhook({
            tema: title,
            abordagem: prompt,
            briefingId: createdBriefing.id.toString(),
            userId: user.id.toString(),
        });

        if (!webhookResult.ok) {
            throw new Error(`Webhook failed: ${webhookResult.message}`);
        }

        return createApiResponseUseCase.SUCCESS({
            route,
            body: body,
            message: 'Briefing created successfully',
            data: createdBriefing,
            log: false,
        });
    } catch (error) {
        return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
            route,
            body: body,
            data: { message: `${error instanceof Error ? error.message : error}` },
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
        // Checks whether the text complies with policy standards
        await checkContentUseCase.execute(text);

        const updatedBriefing = await updateBriefingUseCase.execute({
            id,
            userId: user.id,
            data: {
                text,
                status,
            },
        });

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
            data: { message: `${error instanceof Error ? error.message : error}` },
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
            await deleteBriefingUseCase.execute({
                id,
                userId: user.id,
            });

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
