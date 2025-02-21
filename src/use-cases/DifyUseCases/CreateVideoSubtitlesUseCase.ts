import DifyAdapter from '@/adapters/DifyAdapter';

export default class CreateSubtitlesUseCase {
    private difyAdapter: DifyAdapter;

    constructor(difyAdapter: DifyAdapter) {
        this.difyAdapter = difyAdapter;
    }

    async execute({ transcription }: { transcription: string }): Promise<string> {
        const res = await this.difyAdapter.sendAgentMessageRequest(transcription);

        const { message } = await res.json();

        return message;
    }
}
