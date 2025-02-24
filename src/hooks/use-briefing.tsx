'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

// Types
import { IBriefing, IAvatar } from '@/domain/entities/briefing';
import { useFetchData } from './use-fetch-data';
import { usePagination } from './use-pagination';

interface BriefingContextProps {
    briefings: IBriefing[];
    avatars: IAvatar[];
    selectedAvatar: IAvatar | null;
    isLoading: boolean;
    error: string;
    refetch: () => void;
    updateBriefing: (id: number, updatedText: string, status: string) => Promise<void>;
    redoBriefing: (id: number, instruction: string) => Promise<void>;
    deleteBriefing: (id: number) => Promise<void>;
    selectAvatar: (avatar_id: string, widht: number, height: number) => void;
    clearSelectedAvatar: () => void;
    sendVideoToProduction: (briefing: number) => Promise<boolean>;
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    limit: number;
}

const BriefingContext = createContext<BriefingContextProps | undefined>(undefined);

export const BriefingProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = useQueryClient();

    const [avatars, setAvatars] = useState<IAvatar[]>([]);
    const [selectedAvatar, setSelectedAvatar] = useState<IAvatar | null>(null);
    const [width, setWidth] = useState<number>(1280);
    const [height, setHeight] = useState<number>(720);
    const [error, setError] = useState<string>('');

    const limits = {
        sm: 1,
        md: 1,
        lg: 2,
        xl: 3,
    };

    const { page, setPage, limit } = usePagination(limits);

    const { data, isFetching, refetch } = useFetchData<IBriefing>(
        'briefings',
        { page, limit, pollingEnabled: true },
        'briefing',
    );

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
            queryClient.invalidateQueries({ queryKey: ['briefing'] });
        },
    });

    const updateBriefing = async (id: number, updatedText: string, status: string) => {
        await updateMutation.mutateAsync({ id, updatedText, status });
    };

    const redoMutation = useMutation({
        mutationFn: async ({ id, instruction }: { id: number; instruction: string }) => {
            const response = await fetch('/api/briefings/redo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ briefingId: id, instruction }),
            });

            if (!response.ok) {
                throw new Error('Erro ao refazer o briefing');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['briefing'] });
            refetch();
        },
    });

    const redoBriefing = async (id: number, instruction: string) => {
        await redoMutation.mutateAsync({ id, instruction });
    };

    const sendVideoToProduction = async (briefing: number) => {
        if (!selectedAvatar) {
            setError('Nenhum avatar selecionado');
            return false;
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
            return false;
        }

        await queryClient.invalidateQueries({ queryKey: ['briefing'] });
        setError('');
        return true;
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
            queryClient.invalidateQueries({ queryKey: ['briefing'] });
        },
    });

    const deleteBriefing = async (id: number) => {
        await deleteMutation.mutateAsync(id);
    };

    const briefings = data?.data || [];
    const totalPages = data?.pagination?.totalPages || 1;
    return (
        <BriefingContext.Provider
            value={{
                briefings,
                avatars,
                selectedAvatar,
                isLoading: isFetching,
                error,
                refetch,
                updateBriefing,
                redoBriefing,
                deleteBriefing,
                selectAvatar,
                clearSelectedAvatar,
                sendVideoToProduction,
                page,
                setPage,
                totalPages,
                limit,
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
