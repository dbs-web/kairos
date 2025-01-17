import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { parseDateStringDate } from '@/lib/date';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Not allowed', status: 401 });
    }

    const briefings = await prisma.briefing.findMany({
        where: {
            userId: Number(session.user.id),
            status: {
                not: 'ARQUIVADO',
            },
        },
        include: {
            suggestion: true,
        },
        orderBy: {
            date: 'desc',
        },
    });

    return NextResponse.json({ data: briefings });
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
