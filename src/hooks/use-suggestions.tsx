'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ISuggestion } from '@/types/suggestion';

interface SuggestionsContextProps {
    suggestions: ISuggestion[];
    selectedSuggestions: number[];
    isLoading: boolean;
    toggleSelectSuggestion: (id: number) => void;
    sendToProduction: () => Promise<void>;
}

const SuggestionsContext = createContext<SuggestionsContextProps | undefined>(undefined);

export const SuggestionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const [selectedSuggestions, setSelectedSuggestions] = useState<number[]>([]);

    const { data: suggestions = [], isLoading } = useQuery<ISuggestion[]>({
        queryKey: ['suggestions'],
        queryFn: async (): Promise<ISuggestion[]> => {
            const response = await fetch('/api/sugestoes', { method: 'GET' });
            if (!response.ok) {
                throw new Error('Erro ao buscar sugestões');
            }
            const { data } = await response.json();
            return data;
        },
    });

    const toggleSelectSuggestion = useCallback((id: number) => {
        setSelectedSuggestions((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        );
    }, []);

    const mutation = useMutation({
        mutationFn: async (selectedIds: number[]) => {
            const res = await fetch('/api/sugestoes/aprovar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ suggestions: selectedIds }),
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['suggestions'] });
        },
    });

    const sendToProduction = async () => {
        if (selectedSuggestions.length > 0) {
            await mutation.mutateAsync(selectedSuggestions);
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
