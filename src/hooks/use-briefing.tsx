'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
import { IBriefing, IAvatar } from '@/types/briefing';

interface BriefingContextProps {
    briefings: IBriefing[];
    avatars: IAvatar[];
    selectedAvatar: IAvatar | null;
    isLoading: boolean;
    error: string;
    refetch: () => void;
    updateBriefing: (id: number, updatedText: string, status: string) => Promise<void>;
    deleteBriefing: (id: number) => Promise<void>;
    selectAvatar: (avatar_id: string, widht: number, height: number) => void;
    clearSelectedAvatar: () => void;
    sendVideoToProduction: (briefing: number) => void;
}

const BriefingContext = createContext<BriefingContextProps | undefined>(undefined);

export const BriefingProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = useQueryClient();

    const [avatars, setAvatars] = useState<IAvatar[]>([]);
    const [selectedAvatar, setSelectedAvatar] = useState<IAvatar | null>(null);
    const [width, setWidth] = useState<number>(1920);
    const [height, setHeight] = useState<number>(1080);
    const [error, setError] = useState<string>('');

    const {
        data: briefings = [],
        isLoading,
        refetch,
    } = useQuery<IBriefing[]>({
        queryKey: ['briefings'],
        queryFn: async () => {
            const response = await fetch('/api/briefings');
            if (!response.ok) {
                throw new Error('Erro ao buscar briefings');
            }
            const { data } = await response.json();
            return data;
        },
    });

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
            if (e instanceof Error) console.error(e.message);
        }
    };

    useEffect(() => {
        fetchAvatars();
    }, []);

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

    const updateMutation = useMutation({
        mutationFn: async ({
            id,
            updatedText,
            status,
        }: {
            id: number;
            updatedText: string;
            status: string;
        }) => {
            const response = await fetch('/api/briefings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, text: updatedText, status }),
            });
            if (!response.ok) {
                throw new Error('Erro ao atualizar briefing');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['briefings'] });
        },
    });

    const updateBriefing = async (id: number, updatedText: string, status: string) => {
        await updateMutation.mutateAsync({ id, updatedText, status });
    };

    const sendVideoToProduction = async (briefing: number) => {
        if (!selectedAvatar) {
            setError('Nenhum avatar selecionado');
            return;
        }

        const { avatar_id } = selectedAvatar;

        const response = await fetch('/api/briefings/aprovar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                avatar: avatar_id,
                width,
                height,
                briefing,
            }),
        });

        if (!response.ok) {
            setError('Erro ao enviar vídeo para produção');
            return;
        }

        await queryClient.invalidateQueries({ queryKey: ['briefings'] });
        setError('');
    };

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch('/api/briefings', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) {
                throw new Error('Erro ao arquivar briefing');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['briefings'] });
        },
    });

    const deleteBriefing = async (id: number) => {
        await deleteMutation.mutateAsync(id);
    };

    return (
        <BriefingContext.Provider
            value={{
                briefings,
                avatars,
                selectedAvatar,
                isLoading,
                error,
                refetch,
                updateBriefing,
                deleteBriefing,
                selectAvatar,
                clearSelectedAvatar,
                sendVideoToProduction,
            }}
        >
            {children}
        </BriefingContext.Provider>
    );
};

export const useBriefing = (): BriefingContextProps => {
    const context = useContext(BriefingContext);
    if (!context) {
        throw new Error('useBriefing must be used within a BriefingProvider');
    }
    return context;
};
