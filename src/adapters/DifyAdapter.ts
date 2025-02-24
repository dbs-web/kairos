export interface SendContentCreationRequestArgs {
    briefingId: number;
    query: string;
    difyAgentToken: string;
}

export interface SecurityResponse {
    status: boolean,
    justificativa: string
}

export default class DifyAdapter {
    private contentCreationUrl: string;
    private agentMessageUrl: string;
    private subtitleAgentToken: string;
    private securityCheckUrl: string;

    constructor() {
        this.contentCreationUrl = process.env.CONTENT_CREATION_URL ?? '';
        if (!this.contentCreationUrl) {
            throw new Error('contentCreationUrl is not set');
        }

        this.agentMessageUrl = process.env.AGENT_MESSAGE_URL ?? '';
        if (!this.agentMessageUrl) {
            throw new Error('agentMessageUrl is not set');
        }

        this.subtitleAgentToken = process.env.SUBTITLE_AGENT_TOKEN ?? '';
        if (!this.subtitleAgentToken) {
            throw new Error('SUBTITLE_AGENT_TOKEN is not set');
        }

        this.securityCheckUrl = process.env.SECURITY_CHECK_URL ?? "";
        if(!this.securityCheckUrl){
            throw new Error("securityCheckUrl is not set")
        }
    }

    async sendContentCreationRequest({
        briefingId,
        query,
        difyAgentToken,
    }: SendContentCreationRequestArgs) {
        return await fetch(this.contentCreationUrl, {
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

    async sendAgentMessageRequest(message: string) {
        return await fetch(this.agentMessageUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: this.subtitleAgentToken,
                message,
            }),
        });
    }

    async generateNewSuggestions({ difyAgentToken }: { difyAgentToken: string }) {
        await fetch(this.contentCreationUrl, {
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

    async securityCheck({text} : {text: string}): Promise<SecurityResponse>{
        const res = await fetch(this.securityCheckUrl, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
              },
              body: JSON.stringify({
                message: text
              })
        })

        return await res.json()
    }
}
