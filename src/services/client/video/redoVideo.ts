import { IAvatar } from '@/domain/entities/briefing';

export const redoVideo = async (
    payload: { videoId: number; transcription: string },
    avatar: IAvatar,
    dimensions: { width: number; height: number },
): Promise<{ok: boolean, message: string}> => {
    const response = await fetch('/api/videos/redo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            avatar: avatar.avatar_id,
            width: dimensions.width,
            height: dimensions.height,
            videoId: payload.videoId,
            transcription: payload.transcription,
        }),
    });

    const data = await response.json()
    return {ok: response.ok, message: data.message};
};
