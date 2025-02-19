import { NextResponse } from 'next/server';

// Entities
import { UserRoles } from '@/domain/entities/user';
import { Status } from '@/domain/entities/status';

// Use Cases
import { getUserDifyAgentUseCase } from '@/use-cases/UserUseCases';
import { createBriefingsUseCase } from '@/use-cases/BriefingUseCases';
import { updateNewsStatusUseCase } from '@/use-cases/NewsUseCases';
import { sendContentCreationRequestsUseCase } from '@/use-cases/DifyUseCases';
import { withAuthorization } from '@/adapters/withAuthorization';

export const POST = withAuthorization(
    [UserRoles.USER, UserRoles.ADMIN],
    async (request: Request, user) => {
        const userId = user.id;

        try {
            // Check if user has dify token set before any operation
            const difyAgentToken = await getUserDifyAgentUseCase.execute({ userId });

            const { news } = await request.json();

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

            sendContentCreationRequestsUseCase.execute({
                difyAgentToken,
                dataArr: updatedNews,
                briefings: createdBriefings,
            });

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
