'use client';
import { IAvatar } from '@/domain/entities/briefing';
import { useVideoCreation } from '@/hooks/use-video-creation';
import { default as NextImage } from 'next/image';
import { useEffect, useState } from 'react';

interface AvatarProps {
    avatar: IAvatar;
}

export function Avatar({ avatar }: AvatarProps) {
    const { selectAvatar, selectedAvatar } = useVideoCreation();
    const [imageFormat, setImageFormat] = useState<string | null>(null);
    const [width, setWidth] = useState<number>(1280);
    const [height, setHeight] = useState<number>(720);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (avatar?.preview_image_url) {
            const img = new Image();

            img.src = avatar.preview_image_url;
            img.onload = () => {
                setLoading(false);
                if (img.naturalWidth > img.naturalHeight) {
                    setImageFormat('Horizontal');
                    setWidth(1280);
                    setHeight(720);
                } else {
                    setImageFormat('Vertical');
                    setWidth(720);
                    setHeight(1280);
                }
            };
        }
    }, [avatar]);

    const isSelected = selectedAvatar?.avatar_id === avatar.avatar_id;

    return (
        <div
            className="flex flex-col items-center justify-center gap-y-3 place-self-center rounded-xl border border-border bg-card p-4 shadow-md min-w-[200px] max-w-[220px]"
            style={{
                border: isSelected ? 'solid 2px #00B2CC' : '',
                boxShadow: isSelected ? '0px 0px 12px 4px #00B2CC80' : '',
            }}
        >
            <div className="relative h-[140px] w-[140px] overflow-hidden rounded-xl">
                {loading ? (
                    <div className="h-full w-full flex animate-pulse items-center justify-center bg-muted text-xs text-muted-foreground">
                        CARREGANDO
                    </div>
                ) : (
                    <NextImage
                        src={avatar.preview_image_url}
                        alt={avatar.avatar_name}
                        layout="fill"
                        objectFit="cover"
                    />
                )}
            </div>
            <div className="text-center w-full">
                <span className="text-foreground font-medium text-sm block truncate">{avatar.avatar_name}</span>
                <span className="text-xs text-muted-foreground block mt-1">
                    Vídeo: <strong className="text-foreground">{imageFormat}</strong>
                </span>
            </div>

            <button
                onClick={() => selectAvatar(avatar.avatar_id, width, height)}
                className="mt-2 w-full rounded-lg bg-primary px-4 py-2 text-white text-sm transition-all duration-300 hover:shadow-lg"
                style={{
                    background: isSelected
                        ? 'linear-gradient(to right, hsl(191, 65%, 53%), #0085A3)'
                        : '',
                }}
            >
                <span className="text-white">{isSelected ? 'Selecionado' : 'Escolher Avatar'}</span>
            </button>
        </div>
    );
}
