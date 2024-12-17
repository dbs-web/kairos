import { ISuggestion } from '@/types/suggestion';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parseDateStringDate } from '@/lib/date';

export async function POST(request: Request) {
    try {
        const { data } = await request.json();

        if (!Array.isArray(data) || data.length === 0) {
            return NextResponse.json({ status: 400, message: 'Dados inválidos' });
        }

        await prisma.suggestion.createMany({
            data: data.map((suggestion: ISuggestion) => ({
                ...suggestion,
                date: parseDateStringDate(suggestion.date),
                userId: suggestion.userId,
            })),
            skipDuplicates: true,
        });
    } catch (e) {
        return NextResponse.json({ status: 500, message: 'Erro ao criar sugestões', error: e });
    }

    return NextResponse.json({ message: 'Suggestions created successfully!' });
}

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    try {
        const suggestions = await prisma.suggestion.findMany({
            where: { userId: session.user.id },
        });

        return NextResponse.json({ data: suggestions });
    } catch (e) {
        return NextResponse.json({ status: 500, message: 'Erro ao buscar sugestões', error: e });
    }
}
