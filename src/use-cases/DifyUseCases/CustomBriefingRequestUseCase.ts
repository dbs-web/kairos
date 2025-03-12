import DifyAdapter from '@/adapters/DifyAdapter';
import { IBriefing } from '@/domain/entities/briefing';
import { UseCaseError } from '@/shared/errors';
import { checkContentUseCase } from '.';

export default class CustomBriefingRequestUseCase {
    private difyAdapter: DifyAdapter;

    constructor(difyAdapter: DifyAdapter) {
        this.difyAdapter = difyAdapter;
    }

    /**
     * Send content creation request
     * @param difyAgentToken Dify agent token
     * @param briefing Briefing
     * @param prompt Prompt
     *
     * @returns Content creation request response
     * @throws UseCaseError if failed to send content creation request
     */
    async execute({
        difyAgentToken,
        briefing,
        prompt,
    }: {
        difyAgentToken: string;
        briefing: IBriefing;
        prompt: string;
    }) {
        const query = `Faça um conteúdo sobre: ${briefing.title} | ${briefing.date}\n${prompt}`;
        try {
            return await this.difyAdapter.sendContentCreationRequest({
                briefingId: briefing.id,
                query,
                difyAgentToken,
            });
        } catch (error) {
            throw new UseCaseError('Failed to send content creation request', error as Error);
        }
    }
}
