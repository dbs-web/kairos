import { NextRequest, NextResponse } from 'next/server';
import { InstagramService } from '@/services/InstagramService';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ mediaId: string }> }
) {
    try {
        const { userId } = await request.json();
        const { mediaId } = await params;
        console.log('🔍 MEDIA INSIGHTS DEBUG - Request params:', { userId, mediaId });

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        if (!mediaId) {
            return NextResponse.json(
                { error: 'Media ID is required' },
                { status: 400 }
            );
        }

        console.log('🔍 MEDIA INSIGHTS DEBUG - Calling InstagramService.getMediaInsights...');
        const insights = await InstagramService.getMediaInsights(userId, mediaId);
        console.log('🔍 MEDIA INSIGHTS DEBUG - Raw service response:', JSON.stringify(insights, null, 2));

        // Check if we have actual data
        const hasData = insights?.data && Array.isArray(insights.data) && insights.data.length > 0;
        console.log('🔍 MEDIA INSIGHTS DEBUG - Has data:', hasData);
        
        if (hasData) {
            console.log('🔍 MEDIA INSIGHTS DEBUG - Available metrics:', insights.data.map((m: any) => m.name));
            insights.data.forEach((metric: any) => {
                console.log(`🔍 MEDIA INSIGHTS DEBUG - ${metric.name}:`, metric.values?.[0]?.value || 'no value');
            });
        }

        return NextResponse.json({
            insights,
            message: 'Insights retrieved successfully',
            debug: {
                hasData,
                dataLength: insights?.data?.length || 0,
                mediaId,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        const resolvedParams = await params;
        console.error('🔍 MEDIA INSIGHTS DEBUG - Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            mediaId: resolvedParams?.mediaId,
            error
        });
        
        return NextResponse.json(
            {
                error: 'Failed to fetch Instagram insights',
                details: error instanceof Error ? error.message : 'Unknown error',
                debug: {
                    mediaId: resolvedParams?.mediaId,
                    timestamp: new Date().toISOString()
                }
            },
            { status: 500 }
        );
    }
}
