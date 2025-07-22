'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

// Entities
import { ISuggestion } from '@/domain/entities/suggestion';

// Hooks
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetchData } from './use-fetch-data';
import { usePagination } from './use-pagination';

interface SuggestionsContextProps {
    suggestions: ISuggestion[];
    selectedSuggestions: number[];
    suggestionApproaches: Record<number, { approach: string; stance?: 'APOIAR' | 'REFUTAR' }>;
    isLoading: boolean;
    toggleSelectSuggestion: (id: number) => void;
    saveSuggestionApproach: (suggestionId: number, approach: string, stance?: 'APOIAR' | 'REFUTAR') => void;
    getSuggestionApproach: (suggestionId: number) => { approach: string; stance?: 'APOIAR' | 'REFUTAR' } | undefined;
    hasApproach: (suggestionId: number) => boolean;
    sendToProduction: () => Promise<void>;
    archiveSuggestions: () => Promise<void>;
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    limit: number;
}

export const SuggestionsContext = createContext<SuggestionsContextProps | undefined>(undefined);

export const SuggestionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const [selectedSuggestions, setSelectedSuggestions] = useState<number[]>([]);
    const [suggestionApproaches, setSuggestionApproaches] = useState<Record<number, { approach: string; stance?: 'APOIAR' | 'REFUTAR' }>>({});
    const { page, setPage, limit } = usePagination();

    const { data, isLoading } = useFetchData<ISuggestion>(
        'sugestoes',
        { page, limit },
        'suggestions',
    );

    const suggestions = data?.data || [];
    const totalPages = data?.pagination?.totalPages || 1;

    const toggleSelectSuggestion = useCallback((id: number) => {
        setSelectedSuggestions((prev) => {
            const isCurrentlySelected = prev.includes(id);
            if (isCurrentlySelected) {
                // If deselecting, also clear the saved approach
                setSuggestionApproaches((prevApproaches) => {
                    const newApproaches = { ...prevApproaches };
                    delete newApproaches[id];
                    return newApproaches;
                });
                return prev.filter((item) => item !== id);
            } else {
                // If selecting, add to selection
                return [...prev, id];
            }
        });
    }, []);

    const saveSuggestionApproach = useCallback((suggestionId: number, approach: string, stance?: 'APOIAR' | 'REFUTAR') => {
        setSuggestionApproaches((prev) => ({
            ...prev,
            [suggestionId]: { approach, stance },
        }));

        // Ensure the suggestion is selected when approach is saved
        setSelectedSuggestions((prev) =>
            prev.includes(suggestionId) ? prev : [...prev, suggestionId]
        );
    }, []);

    const getSuggestionApproach = useCallback((suggestionId: number) => {
        return suggestionApproaches[suggestionId];
    }, [suggestionApproaches]);

    const hasApproach = useCallback((suggestionId: number) => {
        return !!suggestionApproaches[suggestionId];
    }, [suggestionApproaches]);

    // Mutação para enviar sugestões para produção
    const sendMutation = useMutation({
        mutationFn: async (payload: { suggestions: number[]; approaches: Record<number, { approach: string; stance?: 'APOIAR' | 'REFUTAR' }> }) => {
            const response = await fetch('/api/sugestoes/aprovar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Erro ao aprovar sugestões');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suggestions'] });
        },
    });

    const sendToProduction = async () => {
        if (selectedSuggestions.length > 0) {
            // Filter approaches for selected suggestions only
            const selectedApproaches = Object.fromEntries(
                Object.entries(suggestionApproaches).filter(([id]) =>
                    selectedSuggestions.includes(parseInt(id))
                )
            );

            await sendMutation.mutateAsync({
                suggestions: selectedSuggestions,
                approaches: selectedApproaches
            });
            setSelectedSuggestions([]);
            setSuggestionApproaches({});
        }
    };

    // Mutação para arquivar sugestões
    const archiveMutation = useMutation({
        mutationFn: async (selectedIds: number[]) => {
            const response = await fetch('/api/sugestoes', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: selectedIds }),
            });

            if (!response.ok) {
                throw new Error('Erro ao arquivar sugestões');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suggestions'] });
        },
    });

    const archiveSuggestions = async () => {
        if (selectedSuggestions.length > 0) {
            await archiveMutation.mutateAsync(selectedSuggestions);
            setSelectedSuggestions([]);
        }
    };

    return (
        <SuggestionsContext.Provider
            value={{
                suggestions,
                selectedSuggestions,
                suggestionApproaches,
                isLoading,
                toggleSelectSuggestion,
                saveSuggestionApproach,
                getSuggestionApproach,
                hasApproach,
                sendToProduction,
                archiveSuggestions,
                page,
                setPage,
                totalPages,
                limit,
            }}
        >
            {children}
        </SuggestionsContext.Provider>
    );
};

export const useSuggestions = () => {
    const context = useContext(SuggestionsContext);
    if (!context) {
        throw new Error('useSuggestions must be used within a SuggestionsProvider');
    }
    return context;
};
