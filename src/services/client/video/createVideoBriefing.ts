import { IAvatar } from '@/domain/entities/briefing';

export const createVideoBriefing = async (
    payload: { briefingId: number },
    avatar: IAvatar,
    dimensions: { width: number; height: number },
): Promise<{ ok: boolean; message: string }> => {
    const response = await fetch('/api/briefings/aprovar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            avatar: avatar.avatar_id,
            width: dimensions.width,
            height: dimensions.height,
            briefing: payload.briefingId,
        }),
    });
    const data = await response.json();
    return { ok: response.ok, message: data.message };
};
