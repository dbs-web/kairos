import { Avatar } from './Avatar';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { useBriefing } from '@/hooks/use-briefing';

export default function AvatarList() {
    const { avatars } = useBriefing();
    return (
        <Carousel
            className="mx-auto max-w-sm"
            opts={{
                align: 'start',
            }}
        >
            <CarouselContent>
                {avatars?.length > 0 ? (
                    avatars.map((avatar) => (
                        <CarouselItem key={avatar.avatar_id} className="basis-1/2">
                            <Avatar avatar={avatar} />
                        </CarouselItem>
                    ))
                ) : (
                    <CarouselItem>
                        <div className="h-[120px] w-32 animate-pulse place-self-center rounded-xl bg-neutral-400" />
                        <div className="mt-4 h-4 w-32 animate-pulse place-self-center rounded-xl bg-neutral-300"></div>
                        <div className="mt-4 h-3 w-40 animate-pulse place-self-center rounded-xl bg-neutral-300"></div>
                    </CarouselItem>
                )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
