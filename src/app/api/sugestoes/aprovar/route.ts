import { NextResponse } from 'next/server';

// Entities
import { UserRoles } from '@/domain/entities/user';
import { Status } from '@/domain/entities/status';

// Use Cases
import { updateSuggestionsStatusUseCase } from '@/use-cases/SuggestionUseCases';
import { createBriefingsUseCase } from '@/use-cases/BriefingUseCases';
import { getUserDifyAgentUseCase } from '@/use-cases/UserUseCases';
import { sendContentCreationRequestsUseCase } from '@/use-cases/DifyUseCases';

// Services
import { sendSuggestionToN8nWebhook } from '@/services/client/webhook/sendSuggestionToN8nWebhook';

// Adapters
import { withAuthorization } from '@/adapters/withAuthorization';

export const POST = withAuthorization([UserRoles.USER], async (request, user) => {
    const userId = user.id;
    try {
        const difyAgentToken = await getUserDifyAgentUseCase.execute({ userId });
        const { suggestions, approaches } = await request.json();

        if (!Array.isArray(suggestions) || suggestions.length === 0) {
            return NextResponse.json({ error: 'No suggestions provided.', status: 400 });
        }

        // Update suggestions status to EM_PRODUCAO
        const suggestionsData = await updateSuggestionsStatusUseCase.execute({
            suggestions,
            userId,
            status: Status.EM_PRODUCAO,
        });

        if (suggestionsData.length === 0) {
            // If no suggestion was updated, return an error
            return NextResponse.json({ error: 'No valid suggestions found.', status: 404 });
        }

        // Create the briefings for successfull updated suggestions
        const createdBriefings = await createBriefingsUseCase.execute(suggestionsData);

        // Send webhooks for all suggestions with approaches when going to production
        if (approaches) {
            const webhookPromises = suggestionsData.map(async (suggestion) => {
                const approach = approaches[suggestion.id];
                if (approach) {
                    // Send webhook for all suggestions with approaches
                    const buttonValue = approach.stance ? approach.stance.toLowerCase() : 'neutro';
                    try {
                        await sendSuggestionToN8nWebhook({
                            cliente: userId.toString(),
                            rede_social: suggestion.socialmedia_name,
                            post_url: suggestion.post_url,
                            briefingid: createdBriefings.find(b => b.suggestionId === suggestion.id)?.id?.toString() || "",
                            abordagem: approach.approach,
                            button: buttonValue as 'apoiar' | 'refutar' | 'neutro'
                        });
                        console.log(`Suggestion ${suggestion.id} sent to webhook (${buttonValue})`);
                    } catch (error) {
                        console.error(`Error sending suggestion ${suggestion.id} to webhook:`, error);
                        // Don't fail the entire operation if webhook fails
                    }
                }
            });

            await Promise.allSettled(webhookPromises);
        }

        // Send request to dify create the content of briefing
        await sendContentCreationRequestsUseCase.execute({
            difyAgentToken,
            dataArr: suggestionsData,
            briefings: createdBriefings,
        });

        return NextResponse.json({
            message: `${createdBriefings.length} briefings created and requests sent successfully.`,
            status: 200,
        });
    } catch (error) {
        return NextResponse.json({
            error: 'An error occurred while processing suggestions.',
            status: 500,
        });
    }
});
