'use client';
// Hooks
import { createContext, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetchData } from './use-fetch-data';
import { usePagination } from './use-pagination';
import { useAvatars } from './use-avatars';

// Entities
import { IBriefing, IAvatar } from '@/domain/entities/briefing';

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
    const {
        avatars,
        error,
        selectedAvatar,
        width,
        height,
        setError,
        selectAvatar,
        clearSelectedAvatar,
    } = useAvatars();

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
                const data = await response.json();
                const error = data.message;
                throw new Error(error);
            }
        },
        onSuccess: () => {
            refetch();
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
                body: JSON.stringify({
                    briefingId: id,
                    instruction: instruction,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao refazer briefing');
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
