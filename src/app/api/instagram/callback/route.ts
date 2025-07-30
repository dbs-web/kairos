import { NextResponse } from 'next/server';
import { withAuthorization } from '@/adapters/withAuthorization';
import { UserRoles } from '@/domain/entities/user';
import { InstagramTokenService } from '@/services/InstagramTokenService';

export const POST = withAuthorization([UserRoles.USER], async (request, user) => {
    try {
        const body = await request.json();
        const { code, state } = body;
        
        if (!code) {
            return NextResponse.json(
                { error: 'Authorization code is required' },
                { status: 400 }
            );
        }
        
        // Verify state parameter contains user ID for security
        if (state && !state.includes(`user_${user.id}`)) {
            return NextResponse.json(
                { error: 'Invalid state parameter' },
                { status: 400 }
            );
        }
        
        // Exchange code for access token via our Instagram API
        const instagramApiBase = process.env.INSTAGRAM_API_BASE || 'https://api.dbsweb.com.br/instagram';
        
        const response = await fetch(`${instagramApiBase}/auth/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, state })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to exchange code for token');
        }
        
        const tokenData = await response.json();
        
        // Calculate expiration date (Instagram Business tokens last 60 days)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 60);
        
        // Store token securely
        await InstagramTokenService.storeToken(user.id, {
            accessToken: tokenData.access_token,
            instagramAccountId: tokenData.user_profile?.id || '',
            expiresAt
        });
        
        return NextResponse.json({
            success: true,
            message: 'Instagram account connected successfully',
            profile: tokenData.user_profile,
            expiresAt: expiresAt.toISOString()
        });
        
    } catch (error) {
        console.error('Error in Instagram callback:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to connect Instagram account' },
            { status: 500 }
        );
    }
});
