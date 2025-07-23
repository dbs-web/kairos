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

        // Send the webhook request with a shorter timeout for immediate response
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Webhook request failed with status: ${response.status}`);
        }

        // Return immediately after confirming the workflow started
        return {
            ok: true,
            message: 'Conteúdo enviado para produção! Você receberá o resultado na página de Aprovações em breve.'
        };
    } catch (error) {
        console.error('Error sending to n8n webhook:', error);

        // If it's a timeout, still consider it successful since the request was sent
        if (error instanceof Error && error.name === 'AbortError') {
            return {
                ok: true,
                message: 'Conteúdo enviado para produção! Você receberá o resultado na página de Aprovações em breve.'
            };
        }

        return {
            ok: false,
            message: error instanceof Error ? error.message : 'Erro ao enviar para produção'
        };
    }
};
