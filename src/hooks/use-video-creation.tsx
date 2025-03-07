'use client';
import React, { createContext, useContext } from 'react';
import { useAvatars } from './use-avatars';
import { IAvatar } from '@/domain/entities/briefing';

interface VideoCreationContextProps {
    avatars: IAvatar[];
    selectedAvatar: IAvatar | null;
    error: string;
    selectAvatar: (avatarId: string, width: number, height: number) => void;
    clearSelectedAvatar: () => void;
    sendVideo: (payload: any) => Promise<boolean>;
}

const VideoCreationContext = createContext<VideoCreationContextProps | undefined>(undefined);

interface VideoCreationProviderProps {
    children: React.ReactNode;
    createVideo: (
        payload: any,
        avatar: IAvatar,
        dimensions: { width: number; height: number },
    ) => Promise<boolean>;
}

export const VideoCreationProvider = ({ children, createVideo }: VideoCreationProviderProps) => {
    const {
        avatars,
        selectedAvatar,
        selectAvatar,
        clearSelectedAvatar,
        error,
        setError,
        width,
        height,
    } = useAvatars();

    const sendVideo = async (payload: any) => {
        if (!selectedAvatar) {
            setError('Nenhum avatar selecionado');
            return false;
        }

        try {
            const success = await createVideo(payload, selectedAvatar, { width, height });
            if (success) {
                setError('');
                return true;
            } else {
                setError('Erro ao enviar vídeo para produção');
                return false;
            }
        } catch (error) {
            setError('Erro ao enviar vídeo para produção');
            return false;
        }
    };

    return (
        <VideoCreationContext.Provider
            value={{
                avatars,
                selectedAvatar,
                error,
                selectAvatar,
                clearSelectedAvatar,
                sendVideo,
            }}
        >
            {children}
        </VideoCreationContext.Provider>
    );
};

export const useVideoCreation = (): VideoCreationContextProps => {
    const context = useContext(VideoCreationContext);
    if (!context) {
        throw new Error('useVideoCreation deve ser usado dentro de um VideoCreationProvider');
    }
    return context;
};
