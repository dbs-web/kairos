export interface SendContentCreationRequestArgs {
    briefingId: number;
    query: string;
    difyAgentToken: string;
}

export default class DifyAdapter {
    private content_creation_url: string;

    constructor() {
        this.content_creation_url = process.env.CONTENT_CREATION_URL ?? '';

        if (!this.content_creation_url) {
            throw new Error('CONTENT_CREATION_URL is not set');
        }
    }

    async sendContentCreationRequest({
        briefingId,
        query,
        difyAgentToken,
    }: SendContentCreationRequestArgs) {
        return await fetch(this.content_creation_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: difyAgentToken,
                briefingId,
                message: query,
            }),
        });
    }

    async generateNewSuggestions({ difyAgentToken }: { difyAgentToken: string }) {
        await fetch(this.content_creation_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: difyAgentToken,
                message: 'Gere novos conteúdos para o usuário.',
            }),
        });
    }
}
