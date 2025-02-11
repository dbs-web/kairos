import { getPaginationParams, getSession, isAuthorized } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { UserRoles } from '@/types/user';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const session = await getSession();

    if (!session?.user || !isAuthorized(session, [UserRoles.USER]))
        return NextResponse.json({ error: 'Not Authorized!', status: 401 });

    const userId = session.user.id;

    const { search, page, skip, limit } = getPaginationParams(request);

    const [videos, totalCount] = await Promise.all([
        prisma.video.findMany({
            where: {
                userId,
                OR: [{ title: { contains: search } }, { legenda: { contains: search } }],
            },
            orderBy: {
                id: 'desc',
            },
            skip,
            take: limit,
        }),

        prisma.video.count({
            where: {
                userId,
                OR: [{ title: { contains: search } }, { legenda: { contains: search } }],
            },
        }),
    ]);

    return NextResponse.json({
        data: videos,
        pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        },
        currentPage: page,
        status: 200,
    });
}
