'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface StatusOption {
    label: string;
    value: string;
}

interface SearchDataContextProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    debouncedSearchTerm: string;
    searchText: string;
    setSearchText: (text: string) => void;
    selectedStatus: string | undefined;
    setSelectedStatus: (status: string | undefined) => void;
    statuses: StatusOption[];
    setStatuses: (statuses: StatusOption[]) => void;
    clearFilters: () => void;
}

const SearchDataContext = createContext<SearchDataContextProps | undefined>(undefined);

export const SearchDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [searchText, setSearchText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
    const [statuses, setStatuses] = useState<StatusOption[]>([]);

    // Debouncing para a busca
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const normalizeText = (text: string) => {
        return text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        setSearchText(normalizeText(debouncedSearchTerm));
    }, [debouncedSearchTerm]);

    const clearFilters = () => {
        setSearchText('');
        setSelectedStatus(undefined);
        setSearchTerm('');
    };

    return (
        <SearchDataContext.Provider
            value={{
                searchTerm,
                setSearchTerm,
                debouncedSearchTerm,
                searchText,
                setSearchText,
                selectedStatus,
                setSelectedStatus,
                statuses,
                setStatuses,
                clearFilters,
            }}
        >
            {children}
        </SearchDataContext.Provider>
    );
};

export const useSearchData = (): SearchDataContextProps => {
    const context = useContext(SearchDataContext);
    if (!context) {
        throw new Error('useSearchData must be used within a SearchDataProvider');
    }
    return context;
};
