import { getSession, isAuthorized } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { UserRoles } from '@/types/user';
import { Status } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const session = await getSession();

    if (!session?.user || !isAuthorized(session, [UserRoles.USER]))
        return NextResponse.json({ error: 'Not Authorized!', status: 401 });

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);

    const pageParam = searchParams.get('page') || '1';
    const limitParam = searchParams.get('limit') || '10';

    const search = searchParams.get('search') || '';

    const statusParam = searchParams.get('status');
    const status: Status = Object.values(Status).includes(statusParam as Status)
        ? (statusParam as Status)
        : Status.EM_ANALISE;

    const page = parseInt(pageParam, 10) || 1;
    const limit = parseInt(limitParam, 10) || 10;
    const skip = (page - 1) * limit;

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
