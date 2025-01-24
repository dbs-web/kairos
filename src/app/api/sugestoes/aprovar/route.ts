import { getSession, isAuthorized } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { UserRoles } from '@/types/user';
import { NextResponse } from 'next/server';
import { Status } from '@/types/status';

async function getUserDifyAgent(userId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.difyAgent) {
        throw new Error('User not found or difyAgent not set.');
    }
    return user.difyAgent;
}

async function createBriefings(suggestionsData: any[], userId: number) {
    const briefingsToCreate = suggestionsData.map((suggestion) => ({
        title: suggestion.title,
        date: new Date().toISOString(),
        suggestionId: suggestion.id,
        status: Status.EM_ANALISE,
        userId: userId,
    }));
    return prisma.briefing.createMany({ data: briefingsToCreate });
}

async function sendContentCreationRequest(
    briefingId: number,
    query: string,
    difyAgentToken: string,
) {
    const CONTENT_CREATION_URL = process.env.CONTENT_CREATION_URL ?? '';
    if (!CONTENT_CREATION_URL) {
        throw new Error('CONTENT_CREATION_URL is not set');
    }

    await fetch(CONTENT_CREATION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: difyAgentToken, briefingId, message: query, callback: true }),
    });
}

async function getSuggestionsData(suggestions: number[]) {
    return prisma.suggestion.findMany({
        where: { id: { in: suggestions } },
    });
}

async function updateSuggestionsStatus(suggestions: number[]) {
    await prisma.suggestion.updateMany({
        where: { id: { in: suggestions } },
        data: {
            status: Status.EM_PRODUCAO,
        },
    });
}

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
