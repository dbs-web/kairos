import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { InstagramTokenService } from '@/services/InstagramTokenService';

export async function POST(request: NextRequest) {
    try {
        console.log('Instagram token revoke request received');

        // Get session
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            console.log('No session found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = parseInt(session.user.id);
        console.log('Revoking Instagram token for user:', userId);

        // Use the InstagramTokenService to properly revoke the token
        await InstagramTokenService.revokeToken(userId);

        console.log('Instagram token revoked successfully');

        return NextResponse.json({
            success: true,
            message: 'Instagram token revoked successfully'
        });

    } catch (error) {
        console.error('Error revoking Instagram token:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
