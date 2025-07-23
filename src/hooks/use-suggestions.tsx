'use client';
import React, { createContext, useContext } from 'react';

// Entities
import { ISuggestion } from '@/domain/entities/suggestion';

// Hooks
import { useFetchData } from './use-fetch-data';
import { usePagination } from './use-pagination';

interface SuggestionsContextProps {
    suggestions: ISuggestion[];
    isLoading: boolean;
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    limit: number;
}

export const SuggestionsContext = createContext<SuggestionsContextProps | undefined>(undefined);

export const SuggestionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { page, setPage, limit } = usePagination();

    const { data, isLoading } = useFetchData<ISuggestion>(
        'sugestoes',
        { page, limit },
        'suggestions',
    );

    const suggestions = data?.data || [];
    const totalPages = data?.pagination?.totalPages || 1;



    return (
        <SuggestionsContext.Provider
            value={{
                suggestions,
                isLoading,
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
