import { NextRequest, NextResponse } from 'next/server';
import { InstagramService } from '@/services/InstagramService';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const snapshot = await InstagramService.collectDailySnapshot(userId);

        return NextResponse.json({
            snapshot,
            message: 'Daily snapshot collected successfully'
        });

    } catch (error) {
        console.error('Error collecting Instagram daily snapshot:', error);
        
        return NextResponse.json(
            { 
                error: 'Failed to collect Instagram daily snapshot',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const dailySummary = await InstagramService.getLatestDailySummary(parseInt(userId));
        const demographics = await InstagramService.getLifetimeDemographics(parseInt(userId));

        return NextResponse.json({
            dailySummary,
            demographics,
            message: 'Latest snapshot data retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching Instagram snapshot data:', error);
        
        return NextResponse.json(
            { 
                error: 'Failed to fetch Instagram snapshot data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}