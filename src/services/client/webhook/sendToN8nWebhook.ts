interface N8nWebhookPayload {
    CLIENTE: string;
    TEMA: string;
    FORMATO: string;
    INSTRUÇÕES: string;
    BRIEFINGID: string;
}

interface WebhookRequestData {
    tema: string;
    abordagem: string;
    briefingId?: string;
    userId?: string;
}

const N8N_WEBHOOK_URL = 'https://n8n.dbsweb.com.br/webhook/ef485eb2-4640-4569-b4f4-6a03297fff62';

/**
 * Send data to n8n webhook for content creation
 * @param data - The data to send containing tema, abordagem, and optional briefingId
 * @returns Promise with success status and message
 */
export const sendToN8nWebhook = async (data: WebhookRequestData): Promise<{ ok: boolean; message: string }> => {
    try {
        const payload: N8nWebhookPayload[] = [{
            CLIENTE: data.userId || "Cliente",
            TEMA: data.tema,
            FORMATO: "Kairós",
            INSTRUÇÕES: data.abordagem,
            BRIEFINGID: data.briefingId || ""
        }];

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Webhook request failed with status: ${response.status}`);
        }

        return {
            ok: true,
            message: 'Conteúdo enviado com sucesso para produção!'
        };
    } catch (error) {
        console.error('Error sending to n8n webhook:', error);
        return {
            ok: false,
            message: error instanceof Error ? error.message : 'Erro ao enviar para produção'
        };
    }
};
