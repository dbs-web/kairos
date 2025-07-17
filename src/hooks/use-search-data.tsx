'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchDataContextType {
    searchData: any;
    setSearchData: (data: any) => void;
    searchText: string;
    setSearchText: (text: string) => void;
    selectedStatus: string | null;
    setSelectedStatus: (status: string | null) => void;
    statuses: any[];
    setStatuses: (statuses: any[]) => void;
}

const SearchDataContext = createContext<SearchDataContextType | undefined>(undefined);

export function SearchDataProvider({ children }: { children: ReactNode }) {
    const [searchData, setSearchData] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [statuses, setStatuses] = useState<any[]>([]);

    return (
        <SearchDataContext.Provider value={{ 
            searchData, 
            setSearchData,
            searchText,
            setSearchText,
            selectedStatus,
            setSelectedStatus,
            statuses,
            setStatuses
        }}>
            {children}
        </SearchDataContext.Provider>
    );
}

export function useSearchData() {
    const context = useContext(SearchDataContext);
    if (!context) {
        throw new Error('useSearchData must be used within a SearchDataProvider');
    }
    return context;
}


