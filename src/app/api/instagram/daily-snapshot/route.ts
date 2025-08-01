import { NextRequest, NextResponse } from 'next/server';
import { InstagramService } from '@/services/InstagramService';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();
        console.log('🔍 DAILY SNAPSHOT DEBUG - Request params:', { userId });

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        console.log('🔍 DAILY SNAPSHOT DEBUG - Calling InstagramService.collectDailySnapshot...');
        const snapshot = await InstagramService.collectDailySnapshot(userId);
        console.log('🔍 DAILY SNAPSHOT DEBUG - Snapshot collected:', JSON.stringify(snapshot, null, 2));

        return NextResponse.json({
            snapshot,
            message: 'Daily snapshot collected successfully',
            debug: {
                timeSeriesPoints: snapshot.timeSeriesData?.length || 0,
                hasData: !!snapshot.timeSeriesData && snapshot.timeSeriesData.length > 0,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('🔍 DAILY SNAPSHOT DEBUG - Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            error
        });
        
        return NextResponse.json(
            {
                error: 'Failed to collect Instagram daily snapshot',
                details: error instanceof Error ? error.message : 'Unknown error',
                debug: {
                    timestamp: new Date().toISOString()
                }
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