import { NextRequest, NextResponse } from 'next/server';
import { InstagramService } from '@/services/InstagramService';

export async function POST(request: NextRequest) {
    try {
        const { userId, period = 'day', since, until } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const insights = await InstagramService.getAccountInsights(userId, period, since, until);

        return NextResponse.json({
            insights,
            message: 'Account insights retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching Instagram account insights:', error);
        
        return NextResponse.json(
            { 
                error: 'Failed to fetch Instagram account insights',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}