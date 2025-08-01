import { NextRequest, NextResponse } from 'next/server';
import { InstagramService } from '@/services/InstagramService';

export async function POST(request: NextRequest) {
    try {
        const { userId, period = 'lifetime' } = await request.json();
        console.log('🔍 AUDIENCE INSIGHTS DEBUG - Request params:', { userId, period });

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        console.log('🔍 AUDIENCE INSIGHTS DEBUG - Calling InstagramService.getAudienceInsights...');
        const insights = await InstagramService.getAudienceInsights(userId, period);
        console.log('🔍 AUDIENCE INSIGHTS DEBUG - Raw service response:', JSON.stringify(insights, null, 2));

        // Check if we have actual data
        const hasData = insights?.insights?.data && Array.isArray(insights.insights.data) && insights.insights.data.length > 0;
        console.log('🔍 AUDIENCE INSIGHTS DEBUG - Has data:', hasData);
        
        if (hasData) {
            const demographicsMetric = insights.insights.data.find((metric: any) => metric.name === 'follower_demographics');
            console.log('🔍 AUDIENCE INSIGHTS DEBUG - Demographics metric found:', !!demographicsMetric);
            if (demographicsMetric) {
                console.log('🔍 AUDIENCE INSIGHTS DEBUG - Demographics values:', JSON.stringify(demographicsMetric.values, null, 2));
            }
        }

        return NextResponse.json({
            insights,
            message: 'Audience insights retrieved successfully',
            debug: {
                hasData,
                dataLength: insights?.insights?.data?.length || 0,
                period,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('🔍 AUDIENCE INSIGHTS DEBUG - Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            error
        });
        
        return NextResponse.json(
            {
                error: 'Failed to fetch Instagram audience insights',
                details: error instanceof Error ? error.message : 'Unknown error',
                debug: {
                    timestamp: new Date().toISOString()
                }
            },
            { status: 500 }
        );
    }
}