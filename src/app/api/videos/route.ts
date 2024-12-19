import { getSession, isAuthorized } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { UserRoles } from '@/types/user';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getSession();
    if (!session?.user || !isAuthorized(session, [UserRoles.USER]))
        return NextResponse.json({ error: 'Not Authorized!', status: 401 });

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
