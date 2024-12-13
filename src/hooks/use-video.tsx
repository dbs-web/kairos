'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Typos
import { IVideo } from '@/types/video';

interface VideoContextProps {
    videos: IVideo[];
    isLoading: boolean;
    error: string;
    sendVideoToProduction: (videoId: string, text: string) => Promise<void>;
}

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

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

    const sendVideoMutation = useMutation({
        mutationFn: async (videoData: { videoId: string; text: string }) => {
            const { videoId, text } = videoData;
            const response = await fetch('/api/videos/send-to-production', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ videoId, text }),
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar vídeo para produção');
            }
        },
        onError: (error: any) => {
            setError(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['videos'] });
        },
    });

    const sendVideoToProduction = async (videoId: string, text: string) => {
        await sendVideoMutation.mutateAsync({ videoId, text });
    };

    return (
        <VideoContext.Provider
            value={{
                videos,
                isLoading,
                error,
                sendVideoToProduction,
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
