import { NextRequest, NextResponse } from 'next/server';
import pollingClient from '@/infrastructure/polling/PollingClientSingleton';
import { withAuthorization } from '@/adapters/withAuthorization';
import { UserRoles } from '@/domain/entities/user';

export const POST = withAuthorization([UserRoles.USER], async (request: NextRequest, user) => {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'briefings' | 'videos';

    if (!type) {
        return NextResponse.json({ error: 'Type parameter is required' }, { status: 400 });
    }

    await pollingClient.clearNotificationCount(user.id.toString(), type);
    return NextResponse.json({ success: true });
});
