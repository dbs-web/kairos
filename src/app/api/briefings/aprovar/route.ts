import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user?.id) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const MAKE_VIDEO_CREATION_URL = process.env.MAKE_VIDEO_CREATION_URL ?? '';
    const { avatar, width, height, briefing } = await request.json();

    const brief = await prisma.briefing.findUnique({
        where: { id: briefing },
        include: {
            user: true,
        },
    });

    if (!brief) {
        return NextResponse.json({ status: 404, message: 'Briefing não encontrado' });
    }

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
        await prisma.briefing.update({
            where: { id: briefing },
            data: {
                status: 'EM_PRODUCAO',
            },
        });
    } else {
        return NextResponse.json({ status: 500, message: 'Erro ao criar o vídeo' });
    }

    return NextResponse.json({
        message: 'Briefing aprovado com sucesso!',
        status: 200,
    });
}
