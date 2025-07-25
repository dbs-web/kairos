'use client';
import NewsGrid from '@/components/News/NewsGrid';
import { NewsProvider } from '@/hooks/use-news';
import { SearchDataProvider } from '@/hooks/use-search-data';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VideoCreationProvider } from '@/hooks/use-video-creation';
import { createVideoDirect } from '@/services/client/video/createVideoDirect';

const queryClient = new QueryClient();

export default function Sugestoes() {
    return (
        <QueryClientProvider client={queryClient}>
            <SearchDataProvider>
                <NewsProvider>
                    <VideoCreationProvider createVideo={createVideoDirect}>
                        <NewsGrid />
                    </VideoCreationProvider>
                </NewsProvider>
            </SearchDataProvider>
        </QueryClientProvider>
    );
}
