import { NextResponse } from 'next/server';

// Entities
import { UserRoles } from '@/domain/entities/user';
import { Status } from '@/domain/entities/status';

// Use Cases
import { createBriefingsUseCase } from '@/use-cases/BriefingUseCases';
import { updateNewsStatusUseCase } from '@/use-cases/NewsUseCases';

// Services
import { sendToN8nWebhook } from '@/services/client/webhook/sendToN8nWebhook';
import { withAuthorization } from '@/adapters/withAuthorization';

export const POST = withAuthorization(
    [UserRoles.USER, UserRoles.ADMIN],
    async (request: Request, user) => {
        const userId = user.id;

        try {
            const { news, approaches } = await request.json();

            if (!Array.isArray(news) || news.length === 0) {
                return NextResponse.json({ error: 'No news provided.', status: 400 });
            }

            const updatedNews = await updateNewsStatusUseCase.execute({
                news,
                userId,
                status: Status.EM_PRODUCAO,
            });

            if (updatedNews.length === 0) {
                return NextResponse.json({ error: 'No valid news found.', status: 404 });
            }

            const createdBriefings = await createBriefingsUseCase.fromNews({
                newsData: updatedNews,
                userId,
            });

            // Send webhooks for all news with approaches when going to production
            if (approaches) {
                const webhookPromises = updatedNews.map(async (newsItem) => {
                    const approach = approaches[newsItem.id];
                    if (approach) {
                        try {
                            await sendToN8nWebhook({
                                tema: newsItem.title,
                                abordagem: approach,
                                briefingId: createdBriefings.find(b => b.newsId === newsItem.id)?.id?.toString() || "",
                                userId: userId.toString(),
                            });
                            console.log(`News ${newsItem.id} sent to N8N webhook`);
                        } catch (error) {
                            console.error(`Error sending news ${newsItem.id} to webhook:`, error);
                            // Don't fail the entire operation if webhook fails
                        }
                    }
                });

                await Promise.allSettled(webhookPromises);
            }

            return NextResponse.json({
                message: `${createdBriefings.length} briefings created and requests sent successfully.`,
                status: 200,
            });
        } catch (error) {
            return NextResponse.json({
                error: 'An error occurred while processing news.',
                status: 500,
            });
        }
    },
);
