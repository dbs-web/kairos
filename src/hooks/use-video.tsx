'use client';

import React, { createContext, useContext, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IVideo } from '@/types/video';
import { usePagination } from './use-pagination';
import { useFetchData } from './use-fetch-data';

interface VideoContextProps {
    videos: IVideo[];
    isLoading: boolean;
    error: string;
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    limit: number;
}

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [error, setError] = useState<string>('');

    const { page, setPage, limit } = usePagination(2);

    const { data, isLoading, refetch } = useFetchData<IVideo>('videos', { page, limit }, 'videos');

    const videos = data?.data || [];
    const totalPages = data?.pagination?.totalPages || 1;

    return (
        <VideoContext.Provider
            value={{
                videos,
                isLoading,
                error,
                page,
                setPage,
                totalPages,
                limit,
            }}
        >
            {children}
        </VideoContext.Provider>
    );
};

export const useVideo = () => {
    const context = useContext(VideoContext);
    if (!context) {
        throw new Error('useVideo must be used within a VideoProvider');
    }
    return context;
};
