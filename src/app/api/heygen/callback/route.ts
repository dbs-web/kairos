// Entities
import { HeyGenAvatarVideoStatus, HeyGenStatus } from '@/domain/entities/video';

// Use Cases
import { createApiResponseUseCase } from '@/use-cases/ApiLogUseCases';
import {
    addVideoFailedStatusUseCase,
    addVideoSubtitleUseCase,
    addVideoUrlUseCase,
} from '@/use-cases/VideoUseCases';
import { createSubtitlesUseCase } from '@/use-cases/DifyUseCases';

export async function POST(request: Request) {
    const body = await request.json();
    const route = '/api/heygen/callback';

    // Log the entire callback payload
    console.log('=== HEYGEN CALLBACK RECEIVED ===');
    console.log('Full body:', JSON.stringify(body, null, 2));

    // Also log to database for debugging
    await createApiResponseUseCase.SUCCESS({
        route: route + '/debug',
        body: body,
        message: `DEBUG: Callback received with event_type: ${body.event_type}`,
        log: true,
    });

    try {
        const { event_type, event_data } = body;

        if (!event_type || !event_data) {
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                body,
                message: 'Invalid payload',
                error: 'Missing event_type or event_data',
            });
        }

        const { video_id, url, msg } = event_data;
        
        // Log specific fields
        console.log('Event type:', event_type);
        console.log('Video ID:', video_id);
        console.log('URL received:', url);

        if (event_type === HeyGenAvatarVideoStatus.SUCCESS) {
            console.log('HeyGen callback - Video URL received:', url);
            
            // Convert AWS URL to permanent resource2.heygen.ai URL
            let permanentUrl = url;
            if (url.includes('files2.heygen.ai/aws_pacific/avatar_tmp/')) {
                // Extract video_id from the URL path (before query parameters)
                const urlWithoutQuery = url.split('?')[0]; // Remove query parameters first
                const videoIdMatch = urlWithoutQuery.match(/\/([a-f0-9]{32})\.mp4$/);
                console.log('URL without query:', urlWithoutQuery);
                console.log('Video ID match:', videoIdMatch);
                
                if (videoIdMatch) {
                    const extractedVideoId = videoIdMatch[1];
                    permanentUrl = `https://resource2.heygen.ai/video/transcode/${extractedVideoId}/1280x720.mp4`;
                    console.log('Original URL:', url);
                    console.log('Extracted video ID:', extractedVideoId);
                    console.log('Converted to permanent URL:', permanentUrl);
                } else {
                    console.log('Failed to extract video ID from URL:', url);
                }
            }
            
            // Update video url with permanent URL
            const video = await addVideoUrlUseCase.execute({
                heygenVideoId: video_id,
                url: permanentUrl,
                heygenStatus: HeyGenStatus.SUCCESS,
            });

            // Create subtitles for video
            const subtitle = await createSubtitlesUseCase.execute({
                transcription: video.transcription as string,
            });

            await addVideoSubtitleUseCase.execute({
                id: video.id,
                subtitle,
            });

            return createApiResponseUseCase.SUCCESS({
                route,
                body,
                message: 'Video generataded successfully!',
            });
        } else if (event_type === HeyGenAvatarVideoStatus.FAIL) {
            await addVideoFailedStatusUseCase.execute(video_id);

            return createApiResponseUseCase.SUCCESS({
                route,
                body,
                message: 'Video generation failed!',
                error: msg,
            });
        } else {
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                body,
                message: 'Unhandled event type',
                error: 'Event type is not supported',
            });
        }
    } catch (error) {
        return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
            route,
            body,
            message: 'Internal Server Error',
            error: `Internal server error: ${error instanceof Error ? error.message : error}`,
        });
    }
}







