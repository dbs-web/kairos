import { NextRequest, NextResponse } from 'next/server';
import { InstagramService } from '@/services/InstagramService';

export async function POST(request: NextRequest) {
    try {
        const { userId, limit = 25 } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const media = await InstagramService.getUserMedia(userId, limit);

        return NextResponse.json({
            media,
            message: 'Media retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching Instagram media:', error);
        
        return NextResponse.json(
            { 
                error: 'Failed to fetch Instagram media',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
