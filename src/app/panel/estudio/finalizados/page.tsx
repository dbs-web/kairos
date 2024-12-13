'use client';
import { VideoGrid } from '@/components/Video/VideoGrid';
import { VideoProvider } from '@/hooks/use-video';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Finalizados() {
    return (
        <QueryClientProvider client={queryClient}>
            <VideoProvider>
                <VideoGrid />
            </VideoProvider>
        </QueryClientProvider>
    );
}
