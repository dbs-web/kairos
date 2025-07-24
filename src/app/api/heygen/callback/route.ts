// Entities
import { HeyGenAvatarVideoStatus, HeyGenStatus } from '@/domain/entities/video';

// Use Cases
import { createApiResponseUseCase } from '@/use-cases/ApiLogUseCases';
import {
    addVideoFailedStatusUseCase,
    addVideoSubtitleUseCase,
    addVideoUrlUseCase,
    getVideosUseCase,
    videoService,
} from '@/use-cases/VideoUseCases';
import { createSubtitlesUseCase } from '@/use-cases/DifyUseCases';
import pollingClient from '@/infrastructure/polling/PollingClientSingleton';

export async function POST(request: Request) {
    const body = await request.json();
    const route = '/api/heygen/callback';

    // Log the entire callback payload to database
    await createApiResponseUseCase.SUCCESS({
        route: route + '/received',
        body: body,
        message: `CALLBACK RECEIVED: event_type=${body.event_type}, video_id=${body.event_data?.video_id}`,
        log: true,
    });

    try {
        const { event_type, event_data } = body;

        if (!event_type || !event_data) {
            await createApiResponseUseCase.BAD_REQUEST({
                route: route + '/validation',
                body,
                message: 'Invalid payload - missing event_type or event_data',
                error: 'Missing event_type or event_data',
            });
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                body,
                message: 'Invalid payload',
                error: 'Missing event_type or event_data',
            });
        }

        const { video_id, url, msg } = event_data;
        
        // Log URL processing start
        await createApiResponseUseCase.SUCCESS({
            route: route + '/url-processing',
            body: { video_id, original_url: url, event_type },
            message: `Processing URL for video ${video_id}: ${url}`,
            log: true,
        });

        if (event_type === HeyGenAvatarVideoStatus.SUCCESS) {
            // Convert AWS URL to permanent resource2.heygen.ai URL
            let permanentUrl = url;
            
            if (url.includes('files2.heygen.ai/aws_pacific/avatar_tmp/')) {
                const urlWithoutQuery = url.split('?')[0];
                const videoIdMatch = urlWithoutQuery.match(/([a-f0-9]{32})\.mp4$/);
                
                if (videoIdMatch) {
                    const extractedVideoId = videoIdMatch[1];
                    
                    // Get video from database to check dimensions
                    const video = await getVideosUseCase.byHeyGenId({ heygenVideoId: video_id });
                    const isLandscape = video && video.width > video.height;
                    const dimensions = isLandscape ? '1280x720' : '720x1280';
                    
                    permanentUrl = `https://resource2.heygen.ai/video/transcode/${extractedVideoId}/${dimensions}.mp4`;
                    
                    // Log the conversion for debugging
                    await createApiResponseUseCase.SUCCESS({
                        route: route + '/url-converted',
                        body: { 
                            original_url: url,
                            converted_url: permanentUrl,
                            video_id: extractedVideoId,
                            dimensions: dimensions
                        },
                        message: `URL converted successfully with ${dimensions}`,
                        log: true,
                    });
                }
            }
            
            // Update video url with permanent URL
            const video = await addVideoUrlUseCase.execute({
                heygenVideoId: video_id,
                url: permanentUrl,
                heygenStatus: HeyGenStatus.SUCCESS,
            });

            // Log database update result
            await createApiResponseUseCase.SUCCESS({
                route: route + '/database-updated',
                body: { 
                    video_id: video.id,
                    heygen_video_id: video_id,
                    saved_url: permanentUrl
                },
                message: `Database updated successfully for video ${video.id}`,
                log: true,
            });

            // Create subtitles for video
            const subtitle = await createSubtitlesUseCase.execute({
                transcription: video.transcription as string,
            });

            await addVideoSubtitleUseCase.execute({
                id: video.id,
                subtitle,
            });

            // Get the user ID from the video to send notification
            if (video?.userId) {
                await pollingClient.incrementNotificationCount(video.userId.toString(), 'videos');
            }

            return createApiResponseUseCase.SUCCESS({
                route,
                body,
                message: 'Video generated successfully!',
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







