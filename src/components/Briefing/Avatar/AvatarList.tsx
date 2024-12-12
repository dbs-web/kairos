'use client';
import { useState, useEffect } from 'react';

import { IAvatar } from '@/types/briefing';
import { Avatar } from './Avatar';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

export default function AvatarList() {
    const [avatars, setAvatars] = useState<IAvatar[]>([]);
    const [error, setError] = useState<string>('');

    const fetchAvatars = async () => {
        const res = await fetch('/api/heygen/check-group');
        const data = await res.json();
        if (data?.data?.avatar_list) {
            setAvatars(data.data.avatar_list);
        } else {
            setError('Ocorreu um erro ao encontrar seus avatares');
        }
    };
    useEffect(() => {
        fetchAvatars();
    }, []);

    return (
        <Carousel className="w-48">
            <CarouselContent className="">
                {avatars?.length > 0 &&
                    avatars.map((avatar) => (
                        <CarouselItem key={avatar.avatar_id}>
                            <Avatar avatar={avatar} />
                        </CarouselItem>
                    ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
