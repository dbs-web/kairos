'use client';
import { useEffect } from 'react';
import BriefingGrid from '@/components/Briefing/BriefingGrid';
import { BriefingProvider } from '@/hooks/use-briefing';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Aprovacoes() {
    useEffect(() => {
        // Clear briefings counter when user visits page
        fetch('/api/notifications/clear?type=briefings', { method: 'POST' });
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <BriefingProvider>
                <BriefingGrid />
            </BriefingProvider>
        </QueryClientProvider>
    );
}