import { authOptions } from '@/lib/auth';
import { parseDateToISOString } from '@/lib/date';
import { Suggestion } from '@/models';
import Briefing from '@/models/Briefing';
import { ISuggestion } from '@/types/suggestion';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const MAKE_VIDEO_CREATION_URL = process.env.MAKE_VIDEO_CREATION_URL ?? '';

if (!MAKE_VIDEO_CREATION_URL) {
    throw new Error('MAKE_VIDEO_CREATION_URL was not provided on .env');
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user?.id) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const { avatar, width, height, briefing } = await request.json();
    const brief = await Briefing.findById(briefing);
    const res = await fetch(MAKE_VIDEO_CREATION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user: session.user.id,
            avatar_id: avatar,
            width,
            height,
            text: brief.text.replace(/(\r\n|\n|\r)/gm, ''),
            title: brief.title,
        }),
    });

    if (res.ok) {
        brief.status = 'em-producao';
        await brief.save();
    }

    return NextResponse.json({
        message: 'Sugestões enviadas com sucesso.',
        status: 200,
    });
}
