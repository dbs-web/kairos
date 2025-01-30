import {
    createApiResponse,
    getSession,
    getUserDifyAgent,
    sendContentCreationRequest,
} from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const route = '/api/briefings/redo';

export async function POST(request: Request) {
    const session = await getSession();
    const body = await request.json();

    if (!session || !session?.user?.id) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { briefingId } = body;

        if (!briefingId) {
            return createApiResponse({
                route,
                body,
                status: 405,
                message: 'Dados incompletos',
                error: 'Missing briefing ID',
            });
        }

        const briefing = await prisma.briefing.update({
            where: {
                id: briefingId,
                userId: session.user.id,
            },
            data: {
                status: 'EM_PRODUCAO',
            },
        });

        if (!briefing) {
            return createApiResponse({
                route,
                body,
                status: 405,
                message: 'Invalid briefing id.',
                error: 'The ID provided is not valid.',
            });
        }

        const query = `Refaça esse conteúdo: ${briefing.text}`;
        const difyContentCreation = await getUserDifyAgent(session.user.id);
        await sendContentCreationRequest(briefing.id, query, difyContentCreation);
        return createApiResponse({
            route,
            body,
            status: 200,
            message: 'Briefing redo request successfull',
            error: '',
        });
    } catch (error) {
        return createApiResponse({
            route,
            body,
            status: 500,
            message: `Error on redoing briefing content`,
            error: `${error instanceof Error ? error.message : error}`,
        });
    }
}
