import { useVideo } from '@/hooks/use-video';
import VideoCard from './VideoCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import Pagination from '../ui/pagination';
import VideoSkeleton from './VideoSkeleton';

export function VideoGrid() {
    const { videos, page, totalPages, setPage, isLoading } = useVideo();

    return (
        <ScrollArea className="mb-8 h-full">
            <div className="flex flex-wrap gap-y-8 !pt-0 md:p-8">
                {!isLoading &&
                    videos?.length > 0 &&
                    videos.map((video) => (
                        <div key={`video-${video.id}`} className="basis-1/1 w-full md:basis-1/2">
                            <VideoCard video={video} />
                        </div>
                    ))}

                {isLoading &&
                    Array.from({ length: 2 }).map((_, index) => (
                        <div
                            key={`video-skeleton-${index}`}
                            className="basis-1/1 w-full md:basis-1/2"
                        >
                            <VideoSkeleton />
                        </div>
                    ))}
            </div>

            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </ScrollArea>
    );
}
