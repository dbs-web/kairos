import { getSession, isAuthorized } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { UserRoles } from '@/types/user';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const session = await getSession();

    if (!session?.user || !isAuthorized(session, [UserRoles.USER]))
        return NextResponse.json({ error: 'Not Authorized!', status: 401 });

    const userId = session.user.id;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1'); // Default to page 1
    const limit = 4; // Limit of items per page

    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    const videos = await prisma.video.findMany({
        where: {
            userId,
        },
        orderBy: {
            id: 'desc',
        },
        skip: offset,
        take: limit,
    });

    const totalVideos = await prisma.video.count({
        where: {
            userId,
        },
    });

    return NextResponse.json({
        data: videos,
        totalPages: Math.ceil(totalVideos / limit), // Total number of pages
        currentPage: page,
        status: 200,
    });
}
