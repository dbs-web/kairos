import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY ?? '';

    const { searchParams } = new URL(request.url);
    const queryGroupId = searchParams.get('groupId');

    let groupIdToFetch: string | null = null;

    if (session.user.role === 'ADMIN' && queryGroupId) {
        groupIdToFetch = queryGroupId;
    } else {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });
        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found' });
        }
        groupIdToFetch = user.avatarGroupId;
    }

    if (!groupIdToFetch) {
        return NextResponse.json({ status: 400, message: 'No groupId found' });
    }

    const heygenRes = await fetch(
        `https://api.heygen.com/v2/avatar_group/${groupIdToFetch}/avatars`,
        {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-api-key': HEYGEN_API_KEY,
            },
        },
    );

    if (!heygenRes.ok) {
        return NextResponse.json({ status: 404, message: 'Avatars not found' });
    }

    const data = await heygenRes.json();

    return NextResponse.json(data);
}
