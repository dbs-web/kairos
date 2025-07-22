interface SuggestionN8nWebhookPayload {
    cliente: string;
    rede_social: string;
    post_url: string;
    briefingid: string;
    "instruções específicas": string;
    button: string;
}

interface SuggestionWebhookRequestData {
    cliente?: string;
    rede_social: string;
    post_url: string;
    briefingid?: string;
    abordagem: string;
    button: 'apoiar' | 'refutar' | 'neutro';
}

const SUGGESTION_N8N_WEBHOOK_URL = 'https://n8n.dbsweb.com.br/webhook/b30d3d2d-4848-49cc-83fc-a47e4ffa79fe';

/**
 * Send suggestion data to n8n webhook for Apoiar/Refutar actions
 * @param data - The suggestion data to send containing all required fields
 * @returns Promise with success status and message
 */
export const sendSuggestionToN8nWebhook = async (data: SuggestionWebhookRequestData): Promise<{ ok: boolean; message: string }> => {
    try {
        const payload: SuggestionN8nWebhookPayload[] = [{
            cliente: data.cliente || "Cliente",
            rede_social: data.rede_social,
            post_url: data.post_url,
            briefingid: data.briefingid || "",
            "instruções específicas": data.abordagem,
            button: data.button
        }];

        console.log('Sending suggestion to N8N webhook:', {
            url: SUGGESTION_N8N_WEBHOOK_URL,
            payload: JSON.stringify(payload, null, 2)
        });

        const response = await fetch(SUGGESTION_N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error(`Suggestion webhook failed with status: ${response.status}`);
            // For now, don't throw error to avoid breaking the flow
            // The webhook attempt was made, even if N8N had issues processing it
            return {
                ok: false,
                message: `Webhook chamado mas retornou erro ${response.status}. Dados foram enviados.`
            };
        }

        console.log('Suggestion webhook sent successfully');

        return {
            ok: true,
            message: 'Sugestão enviada com sucesso para o webhook!'
        };
    } catch (error) {
        console.error('Error sending suggestion to n8n webhook:', error);
        return {
            ok: false,
            message: error instanceof Error ? error.message : 'Erro ao enviar sugestão para o webhook'
        };
    }
};
