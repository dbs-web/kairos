// Hooks
import { useEffect, useState } from 'react';

// Entities
import { IAvatar } from '@/domain/entities/briefing';

export const useAvatars = () => {
    const [avatars, setAvatars] = useState<IAvatar[]>([]);
    const [selectedAvatar, setSelectedAvatar] = useState<IAvatar | null>(null);
    const [width, setWidth] = useState<number>(1280);
    const [height, setHeight] = useState<number>(720);
    const [error, setError] = useState<string>('');

    const fetchAvatars = async () => {
        try {
            const response = await fetch('/api/heygen/check-group');
            const data = await response.json();
            if (data?.data?.avatar_list) {
                setAvatars(data.data.avatar_list);
            } else {
                setError('Ocorreu um erro ao encontrar seus avatares');
            }
        } catch (e) {
            setError('Erro ao buscar avatares');
        }
    };

    const selectAvatar = (avatar_id: string, width: number, height: number) => {
        const avatar = avatars.find((a) => a.avatar_id === avatar_id);
        if (avatar) {
            setSelectedAvatar(avatar);
            setWidth(width);
            setHeight(height);
        } else {
            setError('Avatar não encontrado');
        }
    };

    const clearSelectedAvatar = () => {
        setSelectedAvatar(null);
    };

    useEffect(() => {
        fetchAvatars();
    }, []);

    return {
        avatars,
        error,
        selectedAvatar,
        width,
        height,
        setError,
        selectAvatar,
        clearSelectedAvatar,
    };
};
