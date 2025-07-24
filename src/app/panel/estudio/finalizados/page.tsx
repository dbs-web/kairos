'use client';
import { useEffect } from 'react';
import { VideoGrid } from '@/components/Video/VideoGrid';
import { VideoProvider } from '@/hooks/use-video';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Finalizados() {
    useEffect(() => {
        // Clear videos counter when user visits page
        fetch('/api/notifications/clear?type=videos', { method: 'POST' });
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <VideoProvider>
                <VideoGrid />
            </VideoProvider>
        </QueryClientProvider>
    );
}
