import { NextResponse } from 'next/server';
import { withAuthorization } from '@/adapters/withAuthorization';
import { UserRoles } from '@/domain/entities/user';
import { InstagramTokenService } from '@/services/InstagramTokenService';

export const POST = withAuthorization([UserRoles.USER], async (request, user) => {
    try {
        await InstagramTokenService.revokeToken(user.id);
        
        return NextResponse.json({
            success: true,
            message: 'Instagram account disconnected successfully'
        });
        
    } catch (error) {
        console.error('Error disconnecting Instagram:', error);
        return NextResponse.json(
            { error: 'Failed to disconnect Instagram account' },
            { status: 500 }
        );
    }
});
