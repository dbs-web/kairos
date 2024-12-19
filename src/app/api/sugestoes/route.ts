import { ISuggestion } from '@/types/suggestion';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parseDateStringDate } from '@/lib/date';
import { headers } from 'next/headers';
import { getSession, isAuthorized, validateExternalRequest } from '@/lib/api';
import { UserRoles } from '@/types/user';

export async function POST(request: Request) {
    const headersList = await headers();
    const valid = await validateExternalRequest(headersList);

    if (!valid) {
        return NextResponse.json({ error: 'Not Authorized.', status: 401 });
    }

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
    const session = await getSession();
    if (!session?.user || !isAuthorized(session, [UserRoles.USER]))
        return NextResponse.json({ error: 'Not Authorized!', status: 401 });

    try {
        const suggestions = await prisma.suggestion.findMany({
            where: { userId: session.user.id },
        });

        return NextResponse.json({ data: suggestions });
    } catch (e) {
        return NextResponse.json({ status: 500, message: 'Erro ao buscar sugestões', error: e });
    }
}
