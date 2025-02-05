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

    const limits = {
        sm: 1,
        md: 1,
        lg: 2,
        xl: 2,
    };

    const { page, setPage, limit } = usePagination(limits);

    const { data, isLoading } = useFetchData<IVideo>(
        'videos',
        { page, limit, pollingEnabled: true },
        'video',
    );

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
