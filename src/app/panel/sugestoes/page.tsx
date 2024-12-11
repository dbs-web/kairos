'use client';
import SuggestionsGrid from '@/components/Suggestions/SuggestionsGrid';
import { SuggestionsProvider } from '@/hooks/use-suggestions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Sugestoes() {
    return (
        <div className="flex w-full flex-col items-center">
            <QueryClientProvider client={queryClient}>
                <SuggestionsProvider>
                    <SuggestionsGrid />
                </SuggestionsProvider>
            </QueryClientProvider>
        </div>
    );
}
