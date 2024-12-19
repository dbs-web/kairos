import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { validateExternalRequest } from '@/lib/api';

export async function POST(request: Request) {
    const headersList = await headers();
    const valid = await validateExternalRequest(headersList);

    if (!valid) {
        return NextResponse.json({ error: 'Not Authorized.', status: 401 });
    }

    const { briefingId, text } = await request.json();

    if (!briefingId || !text) {
        return NextResponse.json({ error: 'Dados incompletos.', status: 405 });
    }

    await prisma.briefing.update({
        where: {
            id: briefingId,
        },
        data: {
            text,
            status: 'PRODUZIDO',
        },
    });

    return NextResponse.json({ message: 'Briefing autalizado' });
}
