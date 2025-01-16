'use client';

import React, { createContext, useContext, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IVideo } from '@/types/video';

interface VideoContextProps {
    videos: IVideo[];
    isLoading: boolean;
    error: string;
    currentPage: number;
    totalPages: number;
    loadMoreVideos: () => void;
}

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [videos, setVideos] = useState<IVideo[]>([]);
    const [error, setError] = useState<string>('');

    const { isLoading } = useQuery<IVideo[], Error>({
        queryKey: ['videos', currentPage],
        queryFn: async () => {
            const response = await fetch(`/api/videos?page=${currentPage}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar vídeos');
            }
            const { data, totalPages } = await response.json();

            setVideos((prevVideos: IVideo[]) => {
                const newVideos: IVideo[] = data.filter(
                    (video: IVideo) => !prevVideos.some((prevVideo) => prevVideo.id === video.id),
                );
                return [...prevVideos, ...newVideos];
            });

            setTotalPages(totalPages);
            return data;
        },
    });

    const loadMoreVideos = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <VideoContext.Provider
            value={{
                videos,
                isLoading,
                error,
                currentPage,
                totalPages,
                loadMoreVideos,
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
