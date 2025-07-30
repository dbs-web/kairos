import { NextRequest, NextResponse } from 'next/server';
import { InstagramService } from '@/services/InstagramService';

export async function POST(
    request: NextRequest,
    { params }: { params: { mediaId: string } }
) {
    try {
        const { userId } = await request.json();
        const { mediaId } = params;

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

        const insights = await InstagramService.getMediaInsights(userId, mediaId);

        return NextResponse.json({
            insights,
            message: 'Insights retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching Instagram insights:', error);
        
        return NextResponse.json(
            { 
                error: 'Failed to fetch Instagram insights',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
