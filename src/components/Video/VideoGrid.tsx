import { useVideo } from '@/hooks/use-video';
import VideoCard from './VideoCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import Pagination from '../ui/pagination';
import { Skeleton } from '../ui/skeleton';
import { useEffect, useState } from 'react';
import { PiSpinnerThin } from 'react-icons/pi';
import { IVideo } from '@/domain/entities/video';

// Define an interface for the enhanced video with grid class
interface EnhancedVideo extends IVideo {
    gridClass?: string;
}

// Video Card Skeleton Component
const VideoCardSkeleton = () => {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-md">
            {/* Video Container Skeleton */}
            <div className="relative flex aspect-video w-full items-center justify-center bg-muted/50">
                <div className="flex animate-pulse flex-col items-center justify-center">
                    <PiSpinnerThin className="animate-spin text-3xl text-muted" />
                </div>
            </div>

            {/* Content Area Skeleton */}
            <div className="flex flex-grow flex-col p-3">
                <Skeleton className="mb-1 h-5 w-3/4 bg-muted" />
                <Skeleton className="mb-2 h-3 w-1/3 bg-muted" />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="mt-auto flex items-center justify-between border-t border-border px-3 py-2">
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md bg-muted" />
                    <Skeleton className="h-8 w-8 rounded-md bg-muted" />
                </div>
                <Skeleton className="h-8 w-24 rounded-md bg-muted" />
            </div>
        </div>
    );
};

export function VideoGrid() {
    const { videos, page, totalPages, setPage } = useVideo();
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading state
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800); // Simulate loading time

        return () => clearTimeout(timer);
    }, [page]);

    // Function to organize videos in a way that landscapes and portraits look good together
    const organizeVideos = (videos: IVideo[] | undefined): EnhancedVideo[] => {
        if (!videos || videos.length === 0) return [];

        // Separate videos into landscape and portrait
        const landscape = videos.filter((v: IVideo) => v.width === 1920);
        const portrait = videos.filter((v: IVideo) => v.width !== 1920);

        // Create a balanced layout
        const organized: EnhancedVideo[] = [];
        let lIndex = 0;
        let pIndex = 0;

        // Try to alternate but ensure we use all videos
        while (lIndex < landscape.length || pIndex < portrait.length) {
            // Add landscape videos
            if (lIndex < landscape.length) {
                organized.push({
                    ...landscape[lIndex],
                    gridClass: 'col-span-2 md:col-span-1',
                });
                lIndex++;
            }

            // Add portrait videos - can take less space
            if (pIndex < portrait.length) {
                organized.push({
                    ...portrait[pIndex],
                    gridClass: 'col-span-1',
                });
                pIndex++;
            }
        }

        return organized;
    };

    const organizedVideos = organizeVideos(videos);

    return (
        <ScrollArea className="mb-8 h-full w-full">
            <div className="p-6">
                {isLoading ? (
                    // Show skeletons while loading in a regular grid
                    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={`skeleton-${index}`} className="h-full">
                                <VideoCardSkeleton />
                            </div>
                        ))}
                    </div>
                ) : // Show actual videos when loaded
                organizedVideos.length > 0 ? (
                    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {organizedVideos.map((video) => (
                            <div
                                key={`video-${video.id}`}
                                className={`h-full ${video.gridClass || ''}`}
                            >
                                <VideoCard video={video} />
                            </div>
                        ))}
                    </div>
) : (

                    // Empty state
                    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/50 py-16 text-center shadow-sm">
                        <p className="mb-4 text-lg text-foreground/80">Nenhum vídeo disponível.</p>
                    </div>
                )}
            </div>

            {videos && videos.length > 0 && (
                <div className="mt-8 flex justify-center pb-6">
                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                </div>
            )}
        </ScrollArea>
    );
}
