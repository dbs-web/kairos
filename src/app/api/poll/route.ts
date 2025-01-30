import { NextResponse } from 'next/server';
import { isAuthorized, getSession } from '@/lib/api';
import { UserRoles } from '@/types/user';
import { getData } from '@/lib/redis';

export async function GET(request: Request) {
    const session = await getSession();
    if (!session?.user?.id || !isAuthorized(session, [UserRoles.USER])) {
        return NextResponse.json({ message: 'Not Authorized', status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const dataType = searchParams.get('dataType') as 'briefing' | 'video' | null;

    if (!dataType || !['briefing', 'video'].includes(dataType as string))
        return NextResponse.json({ data: {}, status: 400, message: 'Bad Request!' });

    if (
        await getData({
            userId: session.user.id,
            dataType,
        })
    )
        return NextResponse.json({ data: { shouldRefetch: true }, status: 200 });

    return NextResponse.json({ data: { shouldRefetch: false }, status: 200 });
}
