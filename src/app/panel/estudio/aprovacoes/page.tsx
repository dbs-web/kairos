'use client';
import BriefingGrid from '@/components/Briefing/BriefingGrid';
import { BriefingProvider } from '@/hooks/use-briefing';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Aprovacoes() {
    return (
        <QueryClientProvider client={queryClient}>
            <BriefingProvider>
                <BriefingGrid />
            </BriefingProvider>
        </QueryClientProvider>
    );
}
