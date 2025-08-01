import { NextRequest, NextResponse } from 'next/server';
import { InstagramService } from '@/services/InstagramService';

export async function POST(request: NextRequest) {
    try {
        const { userId, days = 30 } = await request.json();
        console.log('🔍 TIME SERIES DEBUG - Request params:', { userId, days });

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        console.log('🔍 TIME SERIES DEBUG - Calling InstagramService.getTimeSeriesData...');
        const timeSeriesData = await InstagramService.getTimeSeriesData(userId, days);
        console.log('🔍 TIME SERIES DEBUG - Raw service response:', JSON.stringify(timeSeriesData, null, 2));

        // Check if we have actual data
        const hasData = Array.isArray(timeSeriesData) && timeSeriesData.length > 0;
        console.log('🔍 TIME SERIES DEBUG - Has data:', hasData, 'Length:', timeSeriesData?.length || 0);
        
        if (hasData) {
            console.log('🔍 TIME SERIES DEBUG - Sample data point:', timeSeriesData[0]);
            console.log('🔍 TIME SERIES DEBUG - Date range:', {
                first: timeSeriesData[0]?.date,
                last: timeSeriesData[timeSeriesData.length - 1]?.date
            });
        }

        return NextResponse.json({
            timeSeriesData,
            message: 'Time series data retrieved successfully',
            debug: {
                hasData,
                dataLength: timeSeriesData?.length || 0,
                days,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('🔍 TIME SERIES DEBUG - Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            error
        });
        
        return NextResponse.json(
            {
                error: 'Failed to fetch Instagram time series data',
                details: error instanceof Error ? error.message : 'Unknown error',
                debug: {
                    timestamp: new Date().toISOString()
                }
            },
            { status: 500 }
        );
    }
}