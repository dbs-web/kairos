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
    private securityCheckUrl: string;
    private subtitleAgentToken: string;
    private securityCheckToken: string;

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

        this.securityCheckToken = process.env.SECURITY_CHECK_TOKEN ?? "";
        if (!this.securityCheckToken){
            throw new Error("SECURITY_CHECK_TOKEN is not set")
        }

        this.securityCheckUrl = process.env.SECURITY_CHECK_URL ?? "";
        if(!this.securityCheckUrl){
            throw new Error("securityCheckUrl is not set")
        }
    }

    private getHeader = (token: string) => {
        return {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        };
    };

    async sendContentCreationRequest({
        briefingId,
        query,
        difyAgentToken,
    }: SendContentCreationRequestArgs) {
        const res = await fetch(this.contentCreationUrl, {
            method: 'POST',
            headers: this.getHeader(difyAgentToken),
            body: JSON.stringify({
                inputs: {
                    text: query,
                    briefingId,
                },
                user: Math.random() * 10000000000, // Generate random number as we dont want dify keeps track of this conversation
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
            headers: this.getHeader(difyAgentToken),
            body: JSON.stringify({
                inputs: {
                    text: 'Gere novos conteúdos para o usuário.',
                },
                user: Math.random() * 10000000000, // Generate random number as we dont want dify keeps track of this conversation
            }),
        });
    }

    async securityCheck({text} : {text: string}){
        const res = await fetch(this.securityCheckUrl, {
            method: "POST",
            headers: this.getHeader(this.securityCheckToken),
              body: JSON.stringify({
                inputs: {
                    text,
                },
                user: Math.random() * 10000000000,
              })
        })

        return await res.json()
    }
}
