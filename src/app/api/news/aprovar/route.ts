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

async function createBriefings(newsData: any[], userId: number) {
    const briefingsToCreate = newsData.map((noticia) => ({
        title: noticia.title,
        date: new Date().toISOString(),
        newsId: noticia.id,
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
        body: JSON.stringify({ token: difyAgentToken, briefingId, message: query }),
    });
}

async function getNewsData(news: number[]) {
    return prisma.news.findMany({
        where: { id: { in: news } },
    });
}

async function updateNewsStatus(news: number[]) {
    await prisma.news.updateMany({
        where: { id: { in: news } },
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
        const { news } = await request.json();

        if (!Array.isArray(news) || news.length === 0) {
            return NextResponse.json({ error: 'No news provided.', status: 400 });
        }

        const newsData = await getNewsData(news.map(Number));
        if (newsData.length === 0) {
            return NextResponse.json({ error: 'No valid news found.', status: 404 });
        }

        const createdBriefings = await createBriefings(newsData, session.user.id);

        const sendContentCreationRequests = newsData.map(async (noticia) => {
            const briefing = await prisma.briefing.findFirst({
                //@ts-expect-error user.id will ever be defined here
                where: { newsId: noticia.id, userId: session.user.id },
            });
            if (briefing) {
                const query = `Faça um conteúdo sobre: ${noticia.title} | ${noticia.date}\n${noticia.title}`;
                await sendContentCreationRequest(briefing.id, query, difyAgentToken);
            }
        });

        await Promise.all(sendContentCreationRequests);
        await updateNewsStatus(news);
        return NextResponse.json({
            message: `${createdBriefings.count} briefings created and requests sent successfully.`,
            status: 200,
        });
    } catch (error) {
        return NextResponse.json({
            error: 'An error occurred while processing news.',
            status: 500,
        });
    }
}
