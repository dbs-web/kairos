'use client';
import SuggestionsGrid from '@/components/Suggestions/SuggestionsGrid';
import { SuggestionsProvider } from '@/hooks/use-suggestions';
import { SearchDataProvider } from '@/hooks/use-search-data';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Sugestoes() {
    return (
        <div className="flex w-full flex-col items-center">
            <QueryClientProvider client={queryClient}>
                <SearchDataProvider>
                    <SuggestionsProvider>
                        <SuggestionsGrid />
                    </SuggestionsProvider>
                </SearchDataProvider>
            </QueryClientProvider>
        </div>
    );
}
