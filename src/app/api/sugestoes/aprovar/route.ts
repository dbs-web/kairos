import { getSession, isAuthorized } from '@/lib/api';
import { parseDateToISOString } from '@/lib/date';
import { prisma } from '@/lib/prisma';
import { UserRoles } from '@/types/user';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session?.user || !isAuthorized(session, [UserRoles.USER]))
        return NextResponse.json({ error: 'Not Authorized!', status: 401 });

    const CONTENT_CREATION_URL = process.env.MAKE_CONTENT_CREATION_URL ?? '';
    const { suggestions } = await request.json();

    if (Array.isArray(suggestions) && suggestions.length > 0) {
        for (const sid of suggestions) {
            const suggestion = await prisma.suggestion.findUnique({
                where: { id: Number(sid) },
            });

            if (suggestion) {
                const date = parseDateToISOString(suggestion.date);

                const res = await fetch(CONTENT_CREATION_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: suggestion.id,
                        date: date,
                        title: suggestion.title,
                        briefing: suggestion.briefing,
                        user: session.user?.id ?? '',
                    }),
                });

                if (!res.ok) {
                    return NextResponse.json({
                        error: 'Ocorreu um erro no envio das sugestões',
                        status: res.status,
                    });
                }

                await prisma.suggestion.update({
                    where: { id: suggestion.id },
                    data: { status: 'EM_PRODUCAO' },
                });
            }
        }
    }

    return NextResponse.json({
        message: 'Sugestões enviadas com sucesso.',
        status: 200,
    });
}
