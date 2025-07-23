// Entities
import { Status } from '@/domain/entities/status';
import { UserRoles } from '@/domain/entities/user';

// Use Cases
import { createApiResponseUseCase } from '@/use-cases/ApiLogUseCases';
import { updateBriefingUseCase } from '@/use-cases/BriefingUseCases';

// Services
import { sendToN8nWebhook } from '@/services/client/webhook/sendToN8nWebhook';
import { withAuthorization } from '@/adapters/withAuthorization';

const route = '/api/briefings/redo';

export const POST = withAuthorization([UserRoles.USER], async (request: Request, user) => {
    const body = await request.json();

    try {
        const { briefingId, instruction } = body;

        const userId = user.id;

        if (!briefingId) {
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                body,
                message: 'Dados incompletos',
                error: 'Missing briefing ID',
            });
        }

        const briefing = await updateBriefingUseCase.execute({
            id: briefingId,
            userId: user.id,
            data: {
                status: Status.EM_PRODUCAO,
            },
        });

        if (!briefing) {
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                body,
                message: 'Invalid briefing id.',
                error: 'The ID provided is not valid.',
            });
        }

        const redoInstruction = `Refaça esse conteúdo: ${briefing.title} | ${briefing.date} \n\n ${briefing.text}\n\n\n\n Instruções para refação:\n${instruction}`;

        // Send to N8N webhook for content creation
        const webhookResult = await sendToN8nWebhook({
            tema: briefing.title,
            abordagem: redoInstruction,
            briefingId: briefing.id.toString(),
            userId: userId.toString(),
        });

        if (!webhookResult.ok) {
            throw new Error(`Webhook failed: ${webhookResult.message}`);
        }

        return createApiResponseUseCase.SUCCESS({
            route,
            body,
            message: 'Briefing redo request successfull',
            error: '',
        });
    } catch (error) {
        return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
            route,
            body,
            message: `Error on redoing briefing content`,
            error: `${error instanceof Error ? error.message : error}`,
        });
    }
});
