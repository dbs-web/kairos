import { NextRequest, NextResponse } from 'next/server';
import { InstagramService } from '@/services/InstagramService';

export async function POST(request: NextRequest) {
    try {
        const { userId, days = 30 } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const timeSeriesData = await InstagramService.getTimeSeriesData(userId, days);

        return NextResponse.json({
            timeSeriesData,
            message: 'Time series data retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching Instagram time series data:', error);
        
        return NextResponse.json(
            { 
                error: 'Failed to fetch Instagram time series data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}