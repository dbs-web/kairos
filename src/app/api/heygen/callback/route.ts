import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const HEYGEN_SECRET = process.env.HEYGEN_SECRET;

function verifySignature(req: NextRequest): boolean {
    return HEYGEN_SECRET == req.headers.get('secret');
}

export async function POST(request: NextRequest) {
    try {
        if (!verifySignature(request))
            return NextResponse.json({ message: 'Invalid Signature', status: 401 });

        const body = await request.json();

        const { event_type, event_data } = body;

        if (!event_type || !event_data) {
            return NextResponse.json({ message: 'Invalid payload', status: 400 }, { status: 400 });
        }

        const { video_id, url, callback_id, msg } = event_data;

        const video = await prisma.video.findUnique({
            where: {
                heygenVideoId: video_id,
            },
        });

        if (!video) {
            return NextResponse.json({ message: 'Video not found', status: 404 }, { status: 404 });
        }

        if (event_type === 'avatar_video.success') {
            await prisma.video.update({
                where: { id: video.id },
                data: {
                    url: url,
                    heygenStatus: 'SUCCESS',
                },
            });

            return NextResponse.json(
                { message: 'Video updated successfully', status: 200 },
                { status: 200 },
            );
        } else if (event_type === 'avatar_video.fail') {
            await prisma.video.update({
                where: { id: video.id },
                data: {
                    heygenStatus: 'FAILED',
                    heygenErrorMsg: msg,
                },
            });

            return NextResponse.json(
                { message: 'Video update failed', status: 200 },
                { status: 200 },
            );
        } else {
            return NextResponse.json(
                { message: 'Unhandled event type', status: 400 },
                { status: 400 },
            );
        }
    } catch (error) {
        console.error('Error handling HeyGen callback:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', status: 500 },
            { status: 500 },
        );
    }
}
