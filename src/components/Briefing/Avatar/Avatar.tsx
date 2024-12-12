import { IAvatar } from '@/types/briefing';
import Image from 'next/image';

interface AvatarProps {
    avatar: IAvatar;
}

export function Avatar({ avatar }: AvatarProps) {
    if (!avatar) return null;

    return (
        <div className="flex flex-col items-center justify-center gap-y-4 place-self-center">
            <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full">
                <Image
                    src={avatar.preview_image_url}
                    alt={avatar.avatar_name}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <span>{avatar.avatar_name}</span>
        </div>
    );
}
