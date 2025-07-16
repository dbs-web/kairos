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
            className="w-full max-w-6xl mx-auto"
            opts={{
                align: 'start',
                loop: false,
            }}
        >
            <CarouselContent className="py-6 px-4">
                {avatars?.length > 0
                    ? avatars.map((avatar) => (
                          <CarouselItem
                              key={avatar.avatar_id}
                              className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4"
                          >
                              <Avatar avatar={avatar} />
                          </CarouselItem>
                      ))
                    : Array.from({ length: 4 }).map((_, index) => (
                          <CarouselItem
                              className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4"
                              key={`carousel-skeleton-${index}`}
                          >
                              <div className="flex flex-col items-center gap-3 p-4 min-w-[200px] max-w-[220px]">
                                  <div className="h-[140px] w-[140px] animate-pulse rounded-xl bg-muted" />
                                  <div className="h-4 w-32 animate-pulse rounded bg-muted/70"></div>
                                  <div className="h-3 w-24 animate-pulse rounded bg-muted/50"></div>
                                  <div className="h-8 w-full animate-pulse rounded bg-muted/30"></div>
                              </div>
                          </CarouselItem>
                      ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
        </Carousel>
    );
}
