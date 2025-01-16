import { useVideo } from '@/hooks/use-video';
import VideoCard from './VideoCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDataFilter } from '@/hooks/use-data-filter';
import { useEffect } from 'react';

export function VideoGrid() {
    const { videos, isLoading, loadMoreVideos, currentPage, totalPages } = useVideo();
    const { filteredData, setInitialData } = useDataFilter();

    useEffect(() => {
        setInitialData(videos);
    }, [videos]);

    return (
        <ScrollArea className="h-full">
            <div className="flex flex-wrap gap-y-8 p-8 !pt-0">
                {filteredData?.length > 0 &&
                    filteredData.map((video) => (
                        <div key={`video-${video.id}`} className="basis-1/2">
                            <VideoCard video={video} />
                        </div>
                    ))}
            </div>

            {currentPage < totalPages && (
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={loadMoreVideos}
                        className="w-48 rounded-md bg-blue-500 py-2 text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Carregando...' : 'Ver Mais'}
                    </button>
                </div>
            )}
        </ScrollArea>
    );
}
