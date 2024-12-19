'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

// Typos
import { IVideo } from '@/types/video';

interface VideoContextProps {
    videos: IVideo[];
    isLoading: boolean;
    error: string;
}

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [error, setError] = useState<string>('');

    const { data: videos = [], isLoading } = useQuery<IVideo[]>({
        queryKey: ['videos'],
        queryFn: async (): Promise<IVideo[]> => {
            const response = await fetch('/api/videos');
            if (!response.ok) {
                throw new Error('Erro ao buscar vídeos');
            }
            const { data } = await response.json();
            return data;
        },
    });

    return (
        <VideoContext.Provider
            value={{
                videos,
                isLoading,
                error,
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
