import { IAvatar } from '@/domain/entities/briefing';

export const createVideoDirect = async (
    payload: { title: string; text: string },
    avatar: IAvatar,
    dimensions: { width: number; height: number },
): Promise<{ ok: boolean; message: string }> => {
    const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            avatar: avatar.avatar_id,
            width: dimensions.width,
            height: dimensions.height,
            title: payload.title,
            text: payload.text,
        }),
    });

    const data = await response.json();

    return { ok: response.ok, message: data.message };
};
