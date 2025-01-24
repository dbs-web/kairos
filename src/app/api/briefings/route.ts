import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { parseDateStringDate } from '@/lib/date';
import { Status } from '@prisma/client';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Not allowed', status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const pageParam = searchParams.get('page') || '1';
    const limitParam = searchParams.get('limit') || '10';

    const search = searchParams.get('search') || '';

    const page = parseInt(pageParam, 10) || 1;
    const limit = parseInt(limitParam, 10) || 10;
    const skip = (page - 1) * limit;

    const [briefings, totalCount] = await Promise.all([
        prisma.briefing.findMany({
            where: {
                userId: Number(session.user.id),
                OR: [{ title: { contains: search } }, { text: { contains: search } }],
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
                OR: [{ title: { contains: search } }],
            },
            skip,
            take: limit,
            orderBy: {
                date: 'desc',
            },
        }),
    ]);

    return NextResponse.json({
        data: briefings,
        pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        },
    });
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Not allowed', status: 401 });
    }

    const { suggestionId, title, date } = await request.json();

    if (!suggestionId || !title || !date) {
        return NextResponse.json({ error: 'Dados incompletos.', status: 405 });
    }

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
            status: 'EM_ANALISE',
        },
    });

    return NextResponse.json({ data: newBriefing });
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Not allowed', status: 401 });
    }

    const { id, text, status } = await request.json();
    if (!id || !text) {
        return NextResponse.json({ error: 'Dados incompletos.', status: 405 });
    }

    const briefing = await prisma.briefing.findUnique({
        where: { id },
    });

    if (!briefing || briefing.userId !== session.user.id) {
        return NextResponse.json({ error: 'Acesso negado.', status: 405 });
    }

    const updatedBriefing = await prisma.briefing.update({
        where: { id },
        data: {
            text,
            ...(status ? { status } : {}),
        },
    });

    return NextResponse.json({ data: updatedBriefing });
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Not allowed', status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
        return NextResponse.json({ error: 'Dados incompletos.', status: 405 });
    }

    const briefing = await prisma.briefing.findUnique({
        where: { id },
    });

    if (!briefing || briefing.userId !== session.user.id) {
        return NextResponse.json({ error: 'Acesso negado.', status: 405 });
    }

    await prisma.briefing.update({
        where: { id },
        data: { status: 'ARQUIVADO' },
    });

    return NextResponse.json({ message: 'Briefing arquivado com sucesso.' });
}
