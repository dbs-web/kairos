'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { INews } from '@/domain/entities/news';
import { usePagination } from './use-pagination';
import { useFetchData } from './use-fetch-data';

interface NewsContextProps {
    news: INews[];
    selectedNews: number[];
    isLoading: boolean;
    toggleSelectNews: (id: number) => void;
    sendToProduction: () => Promise<void>;
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    limit: number;
}

const NewsContext = createContext<NewsContextProps | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const [selectedNews, setSelectedNews] = useState<number[]>([]);
    const { page, setPage, limit } = usePagination();

    const { data, isLoading, refetch } = useFetchData<INews>('news', { page, limit }, 'news');

    const news = data?.data || [];
    const totalPages = data?.pagination?.totalPages || 1;

    const toggleSelectNews = useCallback((id: number) => {
        setSelectedNews((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        );
    }, []);

    const mutation = useMutation({
        mutationFn: async (selectedIds: number[]) => {
            const res = await fetch('/api/news/aprovar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ news: selectedIds }),
            });
            if (!res.ok) {
                throw new Error('Erro ao enviar notícias para produção');
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['news'] });
        },
    });

    const sendToProduction = async () => {
        if (selectedNews.length > 0) {
            await mutation.mutateAsync(selectedNews);
            setSelectedNews([]);
        }
    };

    return (
        <NewsContext.Provider
            value={{
                news,
                selectedNews,
                isLoading,
                toggleSelectNews,
                sendToProduction,
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
