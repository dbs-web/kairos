import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/dbConnect';
import Video from '@/models/Video';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY ?? '';

if (!HEYGEN_API_KEY) {
    throw new Error('You should provide HEYGEN_API_KEY on .env file');
}

export async function POST(request: Request) {
    await dbConnect();
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
        await Video.create({ user, title, legenda, url });
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

    await dbConnect();

    const userId = session.user.id;

    const videos = await Video.find({ user: userId });

    return NextResponse.json({
        data: videos,
        status: 200,
    });
}
