import { NextRequest, NextResponse } from 'next/server';
import { withAuthorization } from '@/adapters/withAuthorization';
import { UserRoles } from '@/domain/entities/user';
import { InstagramService } from '@/services/InstagramService';

export const GET = withAuthorization([UserRoles.USER], async (request, user) => {
    try {
        const profile = await InstagramService.getUserProfile(user.id);

        return NextResponse.json({
            success: true,
            profile
        });

    } catch (error) {
        console.error('Error fetching Instagram profile:', error);

        if (error instanceof Error && error.message.includes('No Instagram token')) {
            return NextResponse.json(
                { error: 'Instagram account not connected' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to fetch Instagram profile' },
            { status: 500 }
        );
    }
});

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const profile = await InstagramService.getUserProfile(userId);

        return NextResponse.json({
            profile,
            message: 'Profile retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching Instagram profile:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch Instagram profile',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
