import { useVideo } from '@/hooks/use-video';
import VideoCard from './VideoCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import Pagination from '../ui/pagination';

export function VideoGrid() {
    const { videos, page, totalPages, setPage } = useVideo();

    return (
        <ScrollArea className="mb-8 h-full">
            <div className="flex flex-wrap gap-y-8 !pt-0 md:p-8">
                {videos?.length > 0 &&
                    videos.map((video) => (
                        <div key={`video-${video.id}`} className="basis-1/1 w-full md:basis-1/2">
                            <VideoCard video={video} />
                        </div>
                    ))}
            </div>

            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </ScrollArea>
    );
}
