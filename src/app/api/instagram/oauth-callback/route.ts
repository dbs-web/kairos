import { NextRequest, NextResponse } from 'next/server';
import { InstagramTokenService } from '@/services/InstagramTokenService';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        
        // Handle Instagram OAuth errors
        if (error) {
            const errorDescription = searchParams.get('error_description') || error;
            console.error('Instagram OAuth error:', error, errorDescription);

            // Redirect to Desempenho page with error
            const callbackUrl = new URL('/panel/estudio/redes-sociais/desempenho', request.url);
            callbackUrl.searchParams.set('error', error);
            callbackUrl.searchParams.set('error_description', errorDescription);

            return NextResponse.redirect(callbackUrl);
        }

        if (!code) {
            console.error('No authorization code received from Instagram');

            const callbackUrl = new URL('/panel/estudio/redes-sociais/desempenho', request.url);
            callbackUrl.searchParams.set('error', 'no_code');
            callbackUrl.searchParams.set('error_description', 'No authorization code received from Instagram');

            return NextResponse.redirect(callbackUrl);
        }
        
        // Extract user ID from state parameter
        let userId: number | null = null;
        if (state && state.startsWith('user_')) {
            const userIdMatch = state.match(/user_(\d+)_/);
            if (userIdMatch) {
                userId = parseInt(userIdMatch[1]);
            }
        }
        
        if (!userId) {
            console.error('Invalid or missing user ID in state parameter:', state);

            const callbackUrl = new URL('/panel/estudio/redes-sociais/desempenho', request.url);
            callbackUrl.searchParams.set('error', 'invalid_state');
            callbackUrl.searchParams.set('error_description', 'Invalid state parameter');

            return NextResponse.redirect(callbackUrl);
        }
        
        try {
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
            await InstagramTokenService.storeToken(userId, {
                accessToken: tokenData.access_token,
                instagramAccountId: tokenData.user_profile?.id || '',
                expiresAt
            });
            
            console.log(`Instagram token stored successfully for user ${userId}`);

            // Redirect to Desempenho page with success
            const callbackUrl = new URL('/panel/estudio/redes-sociais/desempenho', request.url);
            callbackUrl.searchParams.set('success', 'true');
            callbackUrl.searchParams.set('username', tokenData.user_profile?.username || '');
            callbackUrl.searchParams.set('account_type', tokenData.user_profile?.account_type || '');
            callbackUrl.searchParams.set('account_id', tokenData.user_profile?.id || '');

            return NextResponse.redirect(callbackUrl);
            
        } catch (tokenError) {
            console.error('Error exchanging code for token:', tokenError);

            const callbackUrl = new URL('/panel/estudio/redes-sociais/desempenho', request.url);
            callbackUrl.searchParams.set('error', 'token_exchange_failed');
            callbackUrl.searchParams.set('error_description', tokenError instanceof Error ? tokenError.message : 'Failed to exchange code for token');

            return NextResponse.redirect(callbackUrl);
        }

    } catch (error) {
        console.error('Unexpected error in Instagram OAuth callback:', error);

        const callbackUrl = new URL('/panel/estudio/redes-sociais/desempenho', request.url);
        callbackUrl.searchParams.set('error', 'unexpected_error');
        callbackUrl.searchParams.set('error_description', error instanceof Error ? error.message : 'An unexpected error occurred');

        return NextResponse.redirect(callbackUrl);
    }
}
