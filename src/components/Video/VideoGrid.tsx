import { useVideo } from '@/hooks/use-video';
import VideoCard from './VideoCard';
import { ScrollArea } from '@/components/ui/scroll-area';

export function VideoGrid({}) {
    const { videos } = useVideo();
    return (
        <ScrollArea className="h-full">
            <div className="flex flex-wrap gap-y-8 p-8 !pt-0">
                {videos?.length > 0 &&
                    videos.map((video) => (
                        <div key={video.id} className="basis-1/2">
                            <VideoCard video={video} />
                        </div>
                    ))}
            </div>
        </ScrollArea>
    );
}
