'use client';

import React, { createContext, useContext } from 'react';
import { INews } from '@/domain/entities/news';
import { usePagination } from './use-pagination';
import { useFetchData } from './use-fetch-data';

interface NewsContextProps {
    news: INews[];
    isLoading: boolean;
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    limit: number;
}

const NewsContext = createContext<NewsContextProps | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { page, setPage, limit } = usePagination();

    const { data, isLoading, refetch } = useFetchData<INews>('news', { page, limit }, 'news');

    const news = data?.data || [];
    const totalPages = data?.pagination?.totalPages || 1;



    return (
        <NewsContext.Provider
            value={{
                news,
                isLoading,
                page,
                setPage,
                totalPages,
                limit,
            }}
        >
            {children}
        </NewsContext.Provider>
    );
};

export const useNews = () => {
    const context = useContext(NewsContext);
    if (!context) {
        throw new Error('useNews must be used within a NewsProvider');
    }
    return context;
};
