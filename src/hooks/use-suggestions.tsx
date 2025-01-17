'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ISuggestion } from '@/types/suggestion';

interface SuggestionsContextProps {
    suggestions: ISuggestion[];
    selectedSuggestions: number[];
    isLoading: boolean;
    toggleSelectSuggestion: (id: number) => void;
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
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(8);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            let newLimit = 8;
            if (width <= 769) {
                newLimit = 4;
            } else if (width <= 1344) {
                newLimit = 8;
            } else {
                newLimit = 12;
            }
            setLimit(newLimit);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const { data, isLoading } = useQuery({
        queryKey: ['suggestions', page, limit],
        queryFn: async (): Promise<{ data: ISuggestion[]; pagination: { totalPages: number } }> => {
            const response = await fetch(`/api/sugestoes?page=${page}&limit=${limit}`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Erro ao buscar sugestões');
            }
            return response.json();
        },
    });

    const suggestions = data?.data || [];
    const totalPages = data?.pagination?.totalPages || 1;

    const toggleSelectSuggestion = useCallback((id: number) => {
        setSelectedSuggestions((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        );
    }, []);

    // Mutação para enviar sugestões para produção
    const sendMutation = useMutation({
        mutationFn: async (selectedIds: number[]) => {
            const response = await fetch('/api/sugestoes/aprovar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ suggestions: selectedIds }),
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
            await sendMutation.mutateAsync(selectedSuggestions);
            setSelectedSuggestions([]);
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
                isLoading,
                toggleSelectSuggestion,
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
