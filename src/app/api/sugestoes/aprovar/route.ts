import { authOptions } from '@/lib/auth';
import { parseDateToISOString } from '@/lib/date';
import { Suggestion } from '@/models';
import { ISuggestion } from '@/types/suggestion';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const CONTENT_CREATION_URL = process.env.MAKE_CONTENT_CREATION_URL ?? '';

    const { suggestions } = await request.json();

    if (suggestions?.length > 0) {
        suggestions.map(async (sid: string) => {
            const suggestion: ISuggestion | null = await Suggestion.findById(sid);
            if (suggestion) {
                //@ts-expect-error This is a mongoose instance
                const date = parseDateToISOString(new Date(suggestion.date));

                const res = await fetch(CONTENT_CREATION_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: suggestion._id,
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

                suggestion.status = 'em-producao';
                //@ts-expect-error This is a mongoose instance
                await suggestion.save();
            }
        });
    }

    return NextResponse.json({
        message: 'Sugestões enviadas com sucesso.',
        status: 200,
    });
}
