import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY ?? '';
    const { user, title, legenda, video_id } = await request.json();

    const apiUrl = `https://api.heygen.com/v1/video_status.get?video_id=${video_id}`;

    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'x-api-key': HEYGEN_API_KEY,
        },
    });

    const { data } = await response.json();

    if (!data) {
        return NextResponse.json({
            message: 'Ocorreu um erro na chamada à API do HeyGen',
            status: 400,
        });
    }

    const url = data?.video_url;

    if (url) {
        await prisma.video.create({
            data: {
                userId: user,
                title,
                legenda,
                url,
            },
        });
        return NextResponse.json({
            message: 'Vídeo recebido e adicionado com sucesso',
            status: 200,
        });
    }

    return NextResponse.json({
        message: 'Não foi possível encontrar o url do vídeo',
        status: 400,
    });
}

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const userId = session.user.id;

    const videos = await prisma.video.findMany({
        where: {
            userId,
        },
    });

    return NextResponse.json({
        data: videos,
        status: 200,
    });
}
