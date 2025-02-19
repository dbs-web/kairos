import DifyAdapter from '@/adapters/DifyAdapter';

export default class GenerateNewSuggestionUseCase {
    private difyAdapter: DifyAdapter;

    constructor(difyAdapter: DifyAdapter) {
        this.difyAdapter = difyAdapter;
    }

    async execute({ difyAgentToken }: { difyAgentToken: string }) {
        await this.difyAdapter.generateNewSuggestions({ difyAgentToken });
    }
}
