import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { validateExternalRequest, createApiResponse } from '@/lib/api';
import { insertRedisData } from '@/lib/redis';

interface CallbackBody {
    briefingId?: number;
    sources?: string;
    text?: string;
}

async function getTitle(url: string): Promise<{ url: string; title: string }> {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const match = html.match(/<title>(.*?)<\/title>/);
        return { url, title: match ? match[1] : '' };
    } catch (e) {
        return { url, title: '' };
    }
}

export async function POST(request: Request) {
    const route = '/api/briefings/callback';
    const headersList = await headers();
    const body = await request.json();

    try {
        const valid = await validateExternalRequest(headersList);

        if (!valid) {
            return createApiResponse({
                route,
                body: body,
                status: 401,
                message: 'Not Authorized.',
                error: 'Unauthorized request',
            });
        }

        const { briefingId, sources, text }: CallbackBody = body;
        if (!briefingId) {
            return createApiResponse({
                route,
                body: body,
                status: 405,
                message: 'You should provide the briefingId',
                error: 'Missing briefingId',
            });
        }

        if (!text && !sources) {
            return createApiResponse({
                route,
                body: body,
                status: 405,
                message: 'Dados incompletos.',
                error: 'Missing sources or text',
            });
        }

        const updateData: any = {
            status: 'EM_ANALISE',
        };

        if (text) {
            updateData.text = text;
        }

        if (sources) {
            const parsedSources = JSON.parse(sources);
            const urls = parsedSources?.citations || [];

            const sourcesWithTitles = await Promise.all(urls.map(getTitle));
            const content = parsedSources?.content || [];
            updateData.sources = {
                content,
                citations: sourcesWithTitles,
            };
        }

        const briefing = await prisma.briefing.update({
            where: {
                id: briefingId,
            },
            data: updateData,
        });

        await insertRedisData({
            userId: briefing.userId,
            dataType: 'briefing',
        });

        return createApiResponse({
            route,
            body: body,
            status: 200,
            message: 'Briefing atualizado',
        });
    } catch (error) {
        return createApiResponse({
            route,
            body: body,
            status: 500,
            message: 'Internal Server Error',
            error: `Internal server error: ${error instanceof Error ? error.message : error}`,
        });
    }
}
