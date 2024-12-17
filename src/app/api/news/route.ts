import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
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
            status: item.status,
            text: item.text,
            date: item.date,
        })),
        skipDuplicates: true,
    });

    return NextResponse.json({ message: 'News created successfully!' });
}

export async function GET() {
    const news = await prisma.news.findMany();

    return NextResponse.json({ data: news });
}
