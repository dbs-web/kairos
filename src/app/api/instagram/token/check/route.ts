import { NextRequest, NextResponse } from 'next/server';
import { InstagramTokenService } from '@/services/InstagramTokenService';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();
        console.log('Token check for userId:', userId);

        if (!userId) {
            console.log('No userId provided');
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const hasToken = await InstagramTokenService.hasValidToken(userId);
        console.log('Has token result:', hasToken);

        if (!hasToken) {
            console.log('No token found for user:', userId);
            return NextResponse.json(
                { error: 'No Instagram token found' },
                { status: 404 }
            );
        }

        console.log('Token found for user:', userId);
        return NextResponse.json({
            hasToken: true,
            message: 'Instagram token found'
        });

    } catch (error) {
        console.error('Error checking Instagram token:', error);

        return NextResponse.json(
            {
                error: 'Failed to check Instagram token',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
