import { headers } from 'next/headers';
import { getSession, isAuthorized, validateExternalRequest } from '@/lib/api';
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

export async function GET() {
    const session = await getSession();

    if (!session?.user || !isAuthorized(session, [UserRoles.USER]))
        return NextResponse.json({ error: 'Not Authorized!', status: 401 });

    const userId = session.user.id;
    
    const news = await prisma.news.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            id: "desc"
        }
    });

    return NextResponse.json({ data: news });
}
