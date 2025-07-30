import { NextResponse } from 'next/server';
import { withAuthorization } from '@/adapters/withAuthorization';
import { UserRoles } from '@/domain/entities/user';
import { InstagramTokenService } from '@/services/InstagramTokenService';

export const GET = withAuthorization([UserRoles.USER], async (request, user) => {
    try {
        const hasToken = await InstagramTokenService.hasValidToken(user.id);
        const accountId = await InstagramTokenService.getAccountId(user.id);
        const expiresAt = await InstagramTokenService.getTokenExpiration(user.id);
        
        if (!hasToken) {
            return NextResponse.json({
                connected: false,
                message: 'No Instagram account connected'
            });
        }
        
        // Check if token expires soon (within 7 days)
        const expiresWarning = expiresAt && expiresAt.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;
        
        return NextResponse.json({
            connected: true,
            accountId,
            expiresAt: expiresAt?.toISOString(),
            expiresWarning,
            message: 'Instagram account connected'
        });
        
    } catch (error) {
        console.error('Error checking Instagram status:', error);
        return NextResponse.json(
            { error: 'Failed to check Instagram connection status' },
            { status: 500 }
        );
    }
});
