import { headers } from 'next/headers';
import { getPaginationParams, getSession, isAuthorized, validateExternalRequest } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { UserRoles } from '@/types/user';

export async function POST(request: Request) {
    const headersList = await headers();
    const valid = await validateExternalRequest(headersList);

    if (!valid) {
        return NextResponse.json({ error: 'Not Authorized.', status: 401 });
    }

    const { data } = await request.json();

    if (!Array.isArray(data) || data.length === 0) {
        return NextResponse.json({
            message: 'Nenhum dado válido fornecido.',
            status: 400,
        });
    }

    await prisma.news.createMany({
        data: data.map((item: any) => ({
            title: item.title,
            summary: item.summary,
            userId: item.userId,
            url: item.url,
            thumbnail: item.thumbnail,
            status: 'EM_ANALISE',
            text: item.text,
            date: item.date,
        })),
        skipDuplicates: true,
    });

    return NextResponse.json({ message: 'News created successfully!' });
}

export async function GET(request: Request) {
    const session = await getSession();

    if (!session?.user || !isAuthorized(session, [UserRoles.USER]))
        return NextResponse.json({ error: 'Not Authorized!', status: 401 });

    const userId = session.user.id;

    const { search, status, page, limit, skip } = getPaginationParams(request);

    try {
        const [news, totalCount] = await Promise.all([
            prisma.news.findMany({
                where: {
                    userId: session.user.id,
                    status,
                    title: {
                        contains: search,
                    },
                },
                skip,
                take: limit,
                orderBy: { id: 'desc' },
            }),

            prisma.news.count({
                where: {
                    userId: session.user.id,
                    status: status,
                    title: {
                        contains: search,
                    },
                },
            }),
        ]);
        return NextResponse.json({
            data: news,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'Erro ao buscar noticias',
            error: error instanceof Error ? error.message : error,
        });
    }
}
