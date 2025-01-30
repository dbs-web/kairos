import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { HeyGenStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user?.id) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }

    const HEYGEN_API_URL = process.env.HEYGEN_API_URL ?? '';
    const CALLBACK_URL = process.env.HEYGEN_CALLBACK_URL ?? '';

    const { avatar, width, height, briefing } = await request.json();

    const brief = await prisma.briefing.findUnique({
        where: { id: briefing },
        include: {
            user: true,
        },
    });

    if (!brief) {
        return NextResponse.json(
            { status: 404, message: 'Briefing não encontrado' },
            { status: 404 },
        );
    }

    const userVoiceId = brief.user.voiceId;

    if (!userVoiceId) {
        return NextResponse.json(
            { status: 400, message: 'Usuário não possui voice_id cadastrado' },
            { status: 400 },
        );
    }

    const payload = {
        avatar_id: avatar,
        text: brief.text,
        voice_id: userVoiceId,
        callback_url: CALLBACK_URL,
        width,
        height,
        HeyGenStatus: HeyGenStatus.PROCESSING,
    };

    try {
        const res = await fetch(HEYGEN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            const responseData = await res.json();
            const heygenVideoId = responseData.data.video_id;

            if (!heygenVideoId) {
                return NextResponse.json(
                    { status: 500, message: 'Resposta inválida da API do HeyGen' },
                    { status: 500 },
                );
            }

            await prisma.video.create({
                data: {
                    userId: session.user.id,
                    title: brief.title,
                    legenda: '',
                    heygenVideoId: heygenVideoId,
                    heygenStatus: HeyGenStatus.PROCESSING,
                    width,
                    height,
                },
            });

            await prisma.briefing.update({
                where: { id: briefing },
                data: {
                    status: 'APROVADO',
                },
            });
        } else {
            let errorMessage = 'Erro ao criar o vídeo';
            try {
                const errorData = await res.json();
                if (errorData.error) {
                    errorMessage = errorData.error;
                }
            } catch (e) {
                // Ignore parse cases
            }

            return NextResponse.json({ status: 500, message: errorMessage }, { status: 500 });
        }

        return NextResponse.json(
            {
                message: 'Briefing aprovado e vídeo em produção com sucesso!',
                status: 200,
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            { status: 500, message: 'Erro interno ao criar o vídeo' },
            { status: 500 },
        );
    }
}
