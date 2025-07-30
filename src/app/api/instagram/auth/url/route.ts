import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        // Get user session to include user ID in state
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            );
        }

        // Get the state parameter from query if provided
        const { searchParams } = new URL(request.url);
        const customState = searchParams.get('state');

        // Create state with user ID
        const state = `user_${session.user.id}_${Date.now()}${customState ? `_${customState}` : ''}`;

        // Call the FastAPI backend to get the auth URL
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
        const url = new URL(`${backendUrl}/instagram/auth/url`);

        url.searchParams.set('state', state);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend auth URL error:', errorText);
            return NextResponse.json(
                { error: 'Failed to get Instagram auth URL' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error getting Instagram auth URL:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
