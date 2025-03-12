// Use Cases
import { createApiResponseUseCase } from '@/use-cases/ApiLogUseCases';

// Adapters
import { withExternalRequestValidation } from '@/adapters/withExternalRequestValidation';
import { updateBriefingUseCase } from '@/use-cases/BriefingUseCases';
import { DifyStatus } from '@/domain/entities/briefing';
import { Status } from '@/domain/entities/status';

const route = '/api/briefings/callback/error';

export const POST = withExternalRequestValidation(async (request: Request) => {
    const body = await request.json();

    try {
        const { briefingId, message } = body;

        if (!briefingId || !message) {
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                body,
                message: 'You should provide briefingId and message',
            });
        }

        await updateBriefingUseCase.dangerousUpdate({
            id: briefingId,
            data: {
                difyMessage: message,
                difyStatus: DifyStatus.ERROR,
            },
            poll: true,
        });

        return createApiResponseUseCase.SUCCESS({
            route,
            body: body,
            message: 'Error registered successfully.',
        });
    } catch (error) {
        console.log(`${error instanceof Error ? error.message : error}`);
        return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
            route,
            body,
            message: 'Internal Server Error',
            error: `Internal server error: ${error instanceof Error ? error.message : error}`,
        });
    }
});
