import { getServerSession } from 'next-auth';
import Briefing from '@/models/Briefing';
import { dbConnect } from '@/lib/dbConnect';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Not allowed', status: 401 });

    await dbConnect();
    const briefings = await Briefing.find({ user: session.user.id }).populate('suggestion');
    return NextResponse.json({ data: briefings });
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Not allowed', status: 401 });

    const { suggestion, title, text, date } = await request.json();
    if (!suggestion || !title || !text || !date)
        return NextResponse.json({ error: 'Dados incompletos.', status: 405 });

    await dbConnect();
    const newBriefing = new Briefing({
        suggestion,
        title,
        text,
        date,
        user: session.user.id,
        status: 'em-analise',
    });

    await newBriefing.save();
    return NextResponse.json({ data: newBriefing });
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Not allowed', status: 401 });

    const { id, text } = await request.json();
    if (!id || !text) return NextResponse.json({ error: 'Dados incompletos.', status: 405 });

    await dbConnect();
    const briefing = await Briefing.findById(id);
    if (!briefing || briefing.user.toString() !== session.user.id)
        return NextResponse.json({ error: 'Acesso negado.', status: 405 });

    briefing.text = text;
    await briefing.save();
    return NextResponse.json({ data: briefing });
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Not allowed', status: 401 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Dados incompletos.', status: 405 });

    await dbConnect();
    const briefing = await Briefing.findById(id);
    if (!briefing || briefing.user.toString() !== session.user.id)
        return NextResponse.json({ error: 'Acesso negado.', status: 405 });

    briefing.status = 'arquivado';
    await briefing.save();
    return NextResponse.json({ message: 'Briefing arquivado com sucesso.' });
}
