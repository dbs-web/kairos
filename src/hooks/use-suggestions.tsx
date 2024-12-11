'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ISuggestion } from '@/types/suggestion';

interface SuggestionsContextProps {
    suggestions: ISuggestion[];
    filteredSuggestions: ISuggestion[];
    selectedSuggestions: string[];
    filter: { title: string; status: string };
    isLoading: boolean;
    setFilter: (filter: { title: string; status: string }) => void;
    toggleSelectSuggestion: (id: string) => void;
    sendToProduction: () => Promise<void>;
}

const SuggestionsContext = createContext<SuggestionsContextProps | undefined>(undefined);

export const SuggestionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const [filter, setFilter] = useState({ title: '', status: '' });
    const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

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

    const filteredSuggestions = suggestions.filter((s: ISuggestion) => {
        return (
            (filter.title ? s.title.toLowerCase().includes(filter.title.toLowerCase()) : true) &&
            (filter.status ? s.status === filter.status : true)
        );
    });

    const toggleSelectSuggestion = useCallback((id: string) => {
        setSelectedSuggestions((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        );
    }, []);

    const mutation = useMutation({
        mutationFn: async (selectedIds: string[]) => {
            // sent
            console.log(selectedIds);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suggestions'] });
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
                filteredSuggestions,
                selectedSuggestions,
                filter,
                isLoading,
                setFilter,
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
