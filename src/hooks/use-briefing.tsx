// useBriefing.tsx
'use client';

import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
import { IBriefing } from '@/types/briefing';

interface BriefingContextProps {
    briefings: IBriefing[];
    isLoading: boolean;
    refetch: () => void;
    updateBriefing: (id: string, updatedText: string) => Promise<void>;
    deleteBriefing: (id: string) => Promise<void>;
}

const BriefingContext = createContext<BriefingContextProps | undefined>(undefined);

export const BriefingProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = useQueryClient();

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

    // Update Briefing
    const updateMutation = useMutation({
        mutationFn: async ({ id, updatedText }: { id: string; updatedText: string }) => {
            const response = await fetch('/api/briefings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, text: updatedText }),
            });
            if (!response.ok) {
                throw new Error('Erro ao atualizar briefing');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['briefings'] });
        },
    });

    const updateBriefing = async (id: string, updatedText: string) => {
        await updateMutation.mutateAsync({ id, updatedText });
    };

    // Delete Briefing (Archive)
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
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

    const deleteBriefing = async (id: string) => {
        await deleteMutation.mutateAsync(id);
    };

    return (
        <BriefingContext.Provider
            value={{
                briefings,
                isLoading,
                refetch,
                updateBriefing,
                deleteBriefing,
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
