import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { parseDateStringDate } from '@/lib/date';
import { createApiResponse, getPaginationParams } from '@/lib/api';
import { Status } from '@prisma/client';

export async function GET(request: Request) {
    const route = '/api/briefings';
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    if (!session?.user) {
        return createApiResponse({
            route,
            body: { searchParams: searchParams.toString() },
            status: 401,
            message: 'Not allowed',
            error: 'Unauthorized access',
        });
    }

    var { search, status, page, limit, skip } = getPaginationParams(request);

    const possibleStatuses =
        status === Status.EM_ANALISE ? [Status.EM_ANALISE, Status.EM_PRODUCAO] : [status];

    try {
        const [briefings, totalCount] = await Promise.all([
            prisma.briefing.findMany({
                where: {
                    userId: Number(session.user.id),
                    title: { contains: search },
                    text: { contains: search },
                    status: { in: possibleStatuses },
                },
                include: {
                    suggestion: true,
                },
                skip,
                take: limit,
                orderBy: {
                    date: 'desc',
                },
            }),
            prisma.briefing.count({
                where: {
                    userId: Number(session.user.id),
                    title: { contains: search },
                    text: { contains: search },
                    status: { in: possibleStatuses },
                },
            }),
        ]);

        return createApiResponse({
            route,
            body: { searchParams: searchParams.toString() },
            status: 200,
            message: 'Briefings retrieved successfully',
            data: { data: briefings, pagination: { totalPages: Math.ceil(totalCount / limit) } },
        });
    } catch (error) {
        return createApiResponse({
            route,
            body: { searchParams: searchParams.toString() },
            status: 500,
            message: 'Failed to retrieve briefings',
            error: `Internal server error: ${error instanceof Error ? error.message : error}`,
        });
    }
}

export async function POST(request: Request) {
    const route = '/api/briefings';
    const session = await getServerSession(authOptions);
    const body = await request.json();

    if (!session?.user) {
        return createApiResponse({
            route,
            body,
            status: 401,
            message: 'Not allowed',
            error: 'Unauthorized access',
        });
    }

    const { suggestionId, title, date } = await request.json();

    if (!suggestionId || !title || !date) {
        return createApiResponse({
            route,
            body,
            status: 405,
            message: 'Dados incompletos.',
            error: 'Missing required fields',
        });
    }

    try {
        const newBriefing = await prisma.briefing.create({
            data: {
                suggestion: {
                    connect: { id: suggestionId },
                },
                user: {
                    connect: { id: session.user.id },
                },
                title,
                date: parseDateStringDate(date),
                status: 'EM_PRODUCAO',
            },
        });

        return createApiResponse({
            route,
            body,
            status: 200,
            message: 'Briefing created successfully',
        });
    } catch (error) {
        return createApiResponse({
            route,
            body,
            status: 500,
            message: 'Failed to create briefing',
            error: `Internal server error: ${error instanceof Error ? error.message : error}`,
        });
    }
}

export async function PUT(request: Request) {
    const route = '/api/briefings';
    const session = await getServerSession(authOptions);
    const body = await request.json();

    if (!session?.user) {
        return createApiResponse({
            route,
            body,
            status: 401,
            message: 'Not allowed',
            error: 'Unauthorized access',
        });
    }

    const { id, text, status } = body;
    if (!id || !text) {
        return createApiResponse({
            route,
            body,
            status: 405,
            message: 'Dados incompletos.',
            error: 'Missing required fields',
        });
    }

    try {
        const briefing = await prisma.briefing.findUnique({
            where: { id },
        });

        if (!briefing || briefing.userId !== session.user.id) {
            return createApiResponse({
                route,
                body,
                status: 405,
                message: 'Acesso negado.',
                error: 'Unauthorized access to briefing',
            });
        }

        const updatedBriefing = await prisma.briefing.update({
            where: { id },
            data: {
                text,
                ...(status ? { status } : {}),
            },
        });

        return createApiResponse({
            route,
            body: body,
            status: 200,
            message: 'Briefing updated successfully',
            data: updatedBriefing,
        });
    } catch (error) {
        return createApiResponse({
            route,
            body: body,
            status: 500,
            message: 'Failed to update briefing',
            error: `Internal server error: ${error instanceof Error ? error.message : error}`,
        });
    }
}

export async function DELETE(request: Request) {
    const route = '/api/briefings';
    const session = await getServerSession(authOptions);
    const body = await request.json();

    if (!session?.user) {
        return createApiResponse({
            route,
            body,
            status: 401,
            message: 'Not allowed',
            error: 'Unauthorized access',
        });
    }

    const { id } = body;
    if (!id) {
        return createApiResponse({
            route,
            body,
            status: 405,
            message: 'Dados incompletos.',
            error: 'Missing briefing ID',
        });
    }

    try {
        const briefing = await prisma.briefing.findUnique({
            where: { id },
        });

        if (!briefing || briefing.userId !== session.user.id) {
            return createApiResponse({
                route,
                body,
                status: 405,
                message: 'Acesso negado.',
                error: 'Unauthorized access to briefing',
            });
        }

        await prisma.briefing.update({
            where: { id },
            data: { status: 'ARQUIVADO' },
        });

        return createApiResponse({
            route,
            body,
            status: 200,
            message: 'Briefing arquivado com sucesso.',
        });
    } catch (error) {
        return createApiResponse({
            route,
            body: body,
            status: 500,
            message: 'Failed to archive briefing',
            error: `Internal server error: ${error instanceof Error ? error.message : error}`,
        });
    }
}
