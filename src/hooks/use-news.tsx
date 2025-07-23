'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { INews } from '@/domain/entities/news';
import { usePagination } from './use-pagination';
import { useFetchData } from './use-fetch-data';

interface NewsApproach {
    newsId: number;
    approach: string;
}

interface NewsContextProps {
    news: INews[];
    selectedNews: number[];
    newsApproaches: Record<number, string>;
    isLoading: boolean;
    toggleSelectNews: (id: number) => void;
    saveNewsApproach: (newsId: number, approach: string) => void;
    getNewsApproach: (newsId: number) => string | undefined;
    hasApproach: (newsId: number) => boolean;
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
    const [newsApproaches, setNewsApproaches] = useState<Record<number, string>>({});
    const { page, setPage, limit } = usePagination();

    const { data, isLoading, refetch } = useFetchData<INews>('news', { page, limit }, 'news');

    const news = data?.data || [];
    const totalPages = data?.pagination?.totalPages || 1;

    const toggleSelectNews = useCallback((id: number) => {
        setSelectedNews((prev) => {
            const isCurrentlySelected = prev.includes(id);
            if (isCurrentlySelected) {
                // If deselecting and no approach is saved, remove from selection
                return prev.filter((item) => item !== id);
            } else {
                // If selecting, add to selection
                return [...prev, id];
            }
        });
    }, []);

    const saveNewsApproach = useCallback((newsId: number, approach: string) => {
        setNewsApproaches((prev) => ({
            ...prev,
            [newsId]: approach,
        }));

        // Ensure the news is selected when approach is saved
        setSelectedNews((prev) =>
            prev.includes(newsId) ? prev : [...prev, newsId]
        );
    }, []);

    const getNewsApproach = useCallback((newsId: number) => {
        return newsApproaches[newsId];
    }, [newsApproaches]);

    const hasApproach = useCallback((newsId: number) => {
        return Boolean(newsApproaches[newsId]);
    }, [newsApproaches]);

    const mutation = useMutation({
        mutationFn: async (payload: { news: number[]; approaches: Record<number, string> }) => {
            const response = await fetch('/api/news/aprovar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    news: payload.news,
                    approaches: payload.approaches,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao aprovar notícias');
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['news'] });
        },
    });

    const sendToProduction = async () => {
        if (selectedNews.length > 0) {
            // Filter approaches to only include selected news
            const selectedApproaches = selectedNews.reduce((acc, newsId) => {
                if (newsApproaches[newsId]) {
                    acc[newsId] = newsApproaches[newsId];
                }
                return acc;
            }, {} as Record<number, string>);

            await mutation.mutateAsync({
                news: selectedNews,
                approaches: selectedApproaches
            });

            setSelectedNews([]);
            // Keep approaches saved for potential future use
        }
    };

    return (
        <NewsContext.Provider
            value={{
                news,
                selectedNews,
                newsApproaches,
                isLoading,
                toggleSelectNews,
                saveNewsApproach,
                getNewsApproach,
                hasApproach,
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
