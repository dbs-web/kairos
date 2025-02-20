// Entities
import { withExternalRequestValidation } from '@/adapters/withExternalRequestValidation';
import { Status } from '@/domain/entities/status';

import { PollingManager } from '@/infrastructure/polling/PollingManager';

// Use Cases
import { createApiResponseUseCase } from '@/use-cases/ApiLogUseCases';
import { updateBriefingUseCase } from '@/use-cases/BriefingUseCases';

interface CallbackBody {
    briefingId?: number;
    sources?: string;
    text?: string;
}

const route = '/api/briefings/callback';

async function getTitle(url: string): Promise<{ url: string; title: string }> {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const match = html.match(/<title>(.*?)<\/title>/);
        return { url, title: match ? match[1] : '' };
    } catch (e) {
        return { url, title: '' };
    }
}

export const POST = withExternalRequestValidation(async (request: Request) => {
    const body = await request.json();

    try {

        const { briefingId, sources, text }: CallbackBody = body;

        if (!briefingId) {
            return createApiResponseUseCase.USER_NOT_ALLOWED({
                route,
                body: body,
                message: 'You should provide the briefingId',
                error: 'Missing briefingId',
            });
        }

        if (!text && !sources) {
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                body: body,
                message: 'Dados incompletos.',
                error: 'Missing sources or text',
            });
        }

        const updateData: any = {
            status: Status.EM_ANALISE,
        };

        if (text) {
            updateData.text = text;
        }

        if (sources) {
            const parsedSources = JSON.parse(sources);
            const urls = parsedSources?.citations || [];

            const sourcesWithTitles = await Promise.all(urls.map(getTitle));

            const content = parsedSources?.content || [];
            updateData.sources = {
                content,
                citations: sourcesWithTitles,
            };
        }

        const UpdatedBriefing = await updateBriefingUseCase.dangerousUpdate({
            id: briefingId,
            data: updateData,
        });

        if (!UpdatedBriefing) {
            return createApiResponseUseCase.NOT_FOUND({
                route,
                body: body,
                message: 'Briefing not found',
            });
        }

        const pollingManager = new PollingManager();

        await pollingManager.insertData({
            userId: UpdatedBriefing.userId,
            dataType: 'briefing',
        });

        return createApiResponseUseCase.SUCCESS({
            route,
            body: body,
            message: 'Briefing atualizado',
        });
    } catch (error) {
        console.log(`error: ${error instanceof Error ? error.message : error}`);
        return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
            route,
            body: body,
            message: 'Internal Server Error',
            error: `Internal server error: ${error instanceof Error ? error.message : error}`,
        });
    }
});
