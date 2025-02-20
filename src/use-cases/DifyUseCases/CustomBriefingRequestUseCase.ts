import DifyAdapter from '@/adapters/DifyAdapter';
import { IBriefing } from '@/domain/entities/briefing';

export default class CustomBriefingRequestUseCase {
    private difyAdapter: DifyAdapter;

    constructor(difyAdapter: DifyAdapter) {
        this.difyAdapter = difyAdapter;
    }

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

        return await this.difyAdapter.sendContentCreationRequest({
            briefingId: briefing.id,
            query,
            difyAgentToken,
        });
    }
}
