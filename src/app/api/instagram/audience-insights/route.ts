import { NextRequest, NextResponse } from 'next/server';
import { InstagramService } from '@/services/InstagramService';

export async function POST(request: NextRequest) {
    try {
        const { userId, period = 'lifetime' } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const insights = await InstagramService.getAudienceInsights(userId, period);

        return NextResponse.json({
            insights,
            message: 'Audience insights retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching Instagram audience insights:', error);
        
        return NextResponse.json(
            { 
                error: 'Failed to fetch Instagram audience insights',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}