import { NextResponse } from 'next/server';

// Entities
import { UserRoles } from '@/domain/entities/user';

// Services
import { sendToN8nWebhook } from '@/services/client/webhook/sendToN8nWebhook';
import { withAuthorization } from '@/adapters/withAuthorization';

export const POST = withAuthorization([UserRoles.USER], async (request, user) => {
    try {
        // Send request to N8N to generate new suggestions
        const webhookResult = await sendToN8nWebhook({
            tema: 'Gerar novas sugestões',
            abordagem: 'Gere novos conteúdos para o usuário baseado nas tendências atuais e temas relevantes.',
            briefingId: '', // No specific briefing for new suggestion generation
            userId: user.id.toString(),
        });

        if (!webhookResult.ok) {
            throw new Error(`Webhook failed: ${webhookResult.message}`);
        }

        return NextResponse.json({
            message: `Seu conteúdo está sendo gerado, em breve ele estará disponível aqui.`,
            status: 200,
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Erro ao gerar sugestões.',
            status: 500,
        });
    }
});
