'use client';
import { IAvatar } from '@/types/briefing';
import { default as NextImage } from 'next/image';
import { useEffect, useState } from 'react';
import AvatarPreviewDialog from './AvatarPreviewDialog';

interface AvatarProps {
    avatar: IAvatar;
}

export function Avatar({ avatar }: AvatarProps) {
    const [imageFormat, setImageFormat] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (avatar?.preview_image_url) {
            const img = new Image();

            img.src = avatar.preview_image_url;
            img.onload = () => {
                setLoading(false);
                if (img.naturalWidth > img.naturalHeight) {
                    setImageFormat('Horizontal');
                } else {
                    setImageFormat('Vertical');
                }
            };
        }
    }, [avatar]);

    return (
        <div className="flex flex-col items-center justify-center gap-y-4 place-self-center">
            <div className="relative h-[120px] w-[120px] overflow-hidden rounded-xl">
                {loading ? (
                    <div className="h-30 w-30 animate-pulse bg-gray-200">CARREGANDO</div>
                ) : (
                    <AvatarPreviewDialog
                        avatar_name={avatar.avatar_name}
                        avatar_video_url={avatar.preview_video_url}
                    >
                        <NextImage
                            src={avatar.preview_image_url}
                            alt={avatar.avatar_name}
                            layout="fill"
                            objectFit="cover"
                        />
                    </AvatarPreviewDialog>
                )}
            </div>
            <span>{avatar.avatar_name}</span>
            <span className="text-sm text-gray-500">
                Formato do vídeo: <strong className="text-black">{imageFormat}</strong>
            </span>
        </div>
    );
}
