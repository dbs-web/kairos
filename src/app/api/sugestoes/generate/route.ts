import { isAuthorized } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { UserRoles } from '@/types/user';
import { getSession } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const session = await getSession();

    if (!session?.user || !isAuthorized(session, [UserRoles.USER])) {
        return NextResponse.json({ error: 'Not Authorized!', status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user || !user.difyContentCreation) {
        return NextResponse.json({
            erro: 'Invalid user or token for content generation not found',
            status: 404,
        });
    }

    const CONTENT_CREATION_URL = process.env.CONTENT_CREATION_URL ?? '';
    if (!CONTENT_CREATION_URL) {
        throw new Error('CONTENT_CREATION_URL is not set');
    }

    await fetch(CONTENT_CREATION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: user.difyContentCreation, message: 'Gere novos conteúdos' }),
    });

    return NextResponse.json({
        message: `Seu conteúdo está sendo gerado, em breve ele estará disponível aqui.`,
        status: 200,
    });
}
