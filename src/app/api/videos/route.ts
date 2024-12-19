import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

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
