'use client';
import { IAvatar } from '@/domain/entities/briefing';
import { default as NextImage } from 'next/image';
import { useEffect, useState } from 'react';
import { useBriefing } from '@/hooks/use-briefing';

interface AvatarProps {
    avatar: IAvatar;
}

export function Avatar({ avatar }: AvatarProps) {
    const { selectAvatar, selectedAvatar } = useBriefing();
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

    return (
        <div
            className="flex flex-col items-center justify-center gap-y-2 place-self-center rounded-xl bg-white p-4 shadow-md"
            style={{
                border: selectedAvatar?.avatar_id == avatar.avatar_id ? 'solid 2px #ff6933' : '',
                boxShadow:
                    selectedAvatar?.avatar_id == avatar.avatar_id
                        ? '0px 0px 12px 4px #ff693380'
                        : '',
            }}
        >
            <div className="relative h-[120px] w-[120px] overflow-hidden rounded-xl">
                {loading ? (
                    <div className="h-30 w-30 animate-pulse bg-gray-200">CARREGANDO</div>
                ) : (
                    <NextImage
                        src={avatar.preview_image_url}
                        alt={avatar.avatar_name}
                        layout="fill"
                        objectFit="cover"
                    />
                )}
            </div>
            <span>{avatar.avatar_name}</span>
            <span className="text-sm text-gray-500">
                Vídeo: <strong className="text-black">{imageFormat}</strong>
            </span>

            <button
                onClick={() => selectAvatar(avatar.avatar_id, width, height)}
                className="mt-6 rounded-lg bg-primary px-4 py-1 text-white transition-all duration-300 hover:shadow-lg"
                style={{
                    backgroundColor:
                        selectedAvatar?.avatar_id === avatar.avatar_id ? '#ff6933' : '',
                }}
            >
                {selectedAvatar?.avatar_id === avatar.avatar_id ? 'Selecionado' : 'Escolher Avatar'}
            </button>
        </div>
    );
}
