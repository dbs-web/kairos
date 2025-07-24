import { NextResponse } from 'next/server';
import pollingClient from '@/infrastructure/polling/PollingClientSingleton';
import { withAuthorization } from '@/adapters/withAuthorization';
import { UserRoles } from '@/domain/entities/user';

export const GET = withAuthorization([UserRoles.USER], async (request, user) => {
    try {
        await pollingClient.connect();

        // Test incrementing notifications for the current user
        await pollingClient.incrementNotificationCount(user.id.toString(), 'briefings');
        await pollingClient.incrementNotificationCount(user.id.toString(), 'videos');

        const briefingsCount = await pollingClient.getNotificationCount(user.id.toString(), 'briefings');
        const videosCount = await pollingClient.getNotificationCount(user.id.toString(), 'videos');

        return NextResponse.json({
            status: 'Redis working!',
            userId: user.id,
            briefingsCount,
            videosCount
        });
    } catch (error) {
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
});