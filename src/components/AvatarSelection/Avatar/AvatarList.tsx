import { useVideoCreation } from '@/hooks/use-video-creation';
import { Avatar } from './Avatar';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

export default function AvatarList() {
    const { avatars } = useVideoCreation();
    return (
        <Carousel
            className="lg:min-w-3/4 mx-auto max-w-xs sm:max-w-sm lg:max-w-5xl"
            opts={{
                align: 'start',
            }}
        >
            <CarouselContent className="py-4">
                {avatars?.length > 0
                    ? avatars.map((avatar) => (
                          <CarouselItem
                              key={avatar.avatar_id}
                              className="basis-1/1 lg:basis-1/3 xl:basis-1/5"
                          >
                              <Avatar avatar={avatar} />
                          </CarouselItem>
                      ))
                    : Array.from({ length: 5 }).map((_, index) => (
                          <CarouselItem
                              className="basis-1/1 lg:basis-1/3 xl:basis-1/5"
                              key={`carousel-skeleton-${index}`}
                          >
                              <div className="h-[120px] w-32 animate-pulse place-self-center rounded-xl bg-muted" />
                              <div className="mt-4 h-4 w-32 animate-pulse place-self-center rounded-xl bg-muted/70"></div>
                              <div className="mt-4 h-3 w-40 animate-pulse place-self-center rounded-xl bg-muted/50"></div>
                          </CarouselItem>
                      ))}
            </CarouselContent>
            <CarouselPrevious className="bg-card border-border text-foreground hover:bg-muted/30" />
            <CarouselNext className="bg-card border-border text-foreground hover:bg-muted/30" />
        </Carousel>
    );
}