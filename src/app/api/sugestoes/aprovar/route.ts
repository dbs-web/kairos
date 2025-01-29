import {
    createBriefings,
    getSession,
    getSuggestionsData,
    getUserDifyAgent,
    isAuthorized,
    sendContentCreationRequest,
    updateSuggestionsStatus,
} from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { UserRoles } from '@/types/user';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session?.user?.id || !isAuthorized(session, [UserRoles.USER])) {
        return NextResponse.json({ message: 'Not Authorized', status: 401 });
    }

    try {
        const difyAgentToken = await getUserDifyAgent(session.user.id);
        const { suggestions } = await request.json();

        if (!Array.isArray(suggestions) || suggestions.length === 0) {
            return NextResponse.json({ error: 'No suggestions provided.', status: 400 });
        }

        const suggestionsData = await getSuggestionsData(suggestions.map(Number));
        if (suggestionsData.length === 0) {
            return NextResponse.json({ error: 'No valid suggestions found.', status: 404 });
        }

        const createdBriefings = await createBriefings(suggestionsData, session.user.id);

        const sendContentCreationRequests = suggestionsData.map(async (suggestion) => {
            const briefing = await prisma.briefing.findFirst({
                //@ts-expect-error user.id will ever be defined here
                where: { suggestionId: suggestion.id, userId: session.user.id },
            });
            if (briefing) {
                const query = `Faça um conteúdo sobre: ${suggestion.title} | ${suggestion.date}\n ${suggestion.briefing}`;
                await sendContentCreationRequest(briefing.id, query, difyAgentToken);
            }
        });

        await Promise.all(sendContentCreationRequests);
        await updateSuggestionsStatus(suggestions);
        return NextResponse.json({
            message: `${createdBriefings.count} briefings created and requests sent successfully.`,
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            error: 'An error occurred while processing suggestions.',
            status: 500,
        });
    }
}
