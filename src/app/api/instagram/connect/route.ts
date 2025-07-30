import { NextResponse } from 'next/server';
import { withAuthorization } from '@/adapters/withAuthorization';
import { UserRoles } from '@/domain/entities/user';

export const GET = withAuthorization([UserRoles.USER], async (request, user) => {
    try {
        // Get Instagram OAuth authorization URL from our Instagram API
        const instagramApiBase = process.env.INSTAGRAM_API_BASE || 'https://api.dbsweb.com.br/instagram';
        const state = `user_${user.id}_${Date.now()}`; // Include user ID in state for security

        // Store the user ID in the state for later retrieval
        // We'll need this when the callback comes back

        const response = await fetch(`${instagramApiBase}/auth/url?state=${state}`);

        if (!response.ok) {
            throw new Error('Failed to get Instagram authorization URL');
        }

        const data = await response.json();

        // Keep the original redirect URI from Instagram API (it's correctly configured)
        const authUrl = data.auth_url;

        return NextResponse.json({
            authUrl: authUrl,
            state,
            message: 'Redirect user to this URL for Instagram authorization'
        });

    } catch (error) {
        console.error('Error getting Instagram auth URL:', error);
        return NextResponse.json(
            { error: 'Failed to initiate Instagram connection' },
            { status: 500 }
        );
    }
});
