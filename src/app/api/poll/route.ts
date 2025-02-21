import { NextResponse } from 'next/server';

// Entities
import { UserRoles } from '@/domain/entities/user';

// Polling
import pollingClient from '@/infrastructure/polling/PollingClientSingleton';

// Adapters
import { withAuthorization } from '@/adapters/withAuthorization';

export const GET = withAuthorization([UserRoles.USER], async (request, user) => {
    const { searchParams } = new URL(request.url);

    const dataType = searchParams.get('dataType') as 'briefing' | 'video' | null;

    if (!dataType || !['briefing', 'video'].includes(dataType as string))
        return NextResponse.json({ data: {}, status: 400, message: 'Bad Request!' });
    try {
        if (
            await pollingClient.getPollingData({
                userId: user.id,
                dataType,
            })
        )
            return NextResponse.json({ data: { shouldRefetch: true }, status: 200 });

        return NextResponse.json({ data: { shouldRefetch: false }, status: 200 });
    } catch (error) {
        return NextResponse.json({ data: {}, status: 500, message: 'Internal Server Error!' });
    }
});
