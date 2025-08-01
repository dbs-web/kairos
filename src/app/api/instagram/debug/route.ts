import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { InstagramTokenService } from '@/services/InstagramTokenService';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id;
        
        // Check token status
        const hasToken = await InstagramTokenService.hasValidToken(userId);
        const token = await InstagramTokenService.getToken(userId);
        const accountId = await InstagramTokenService.getAccountId(userId);
        
        return NextResponse.json({
            userId,
            hasToken,
            hasTokenValue: !!token,
            tokenLength: token ? token.length : 0,
            hasAccountId: !!accountId,
            accountId: accountId ? accountId.substring(0, 10) + '...' : null,
            debug: 'Instagram token debug info'
        });

    } catch (error) {
        console.error('Error in Instagram debug:', error);
        
        return NextResponse.json(
            { 
                error: 'Debug failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
