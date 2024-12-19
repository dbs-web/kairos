'use client';
import NewsGrid from '@/components/News/NewsGrid';
import { NewsProvider } from '@/hooks/use-news';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Sugestoes() {
    return (
        <div className="flex w-full flex-col items-center">
            <QueryClientProvider client={queryClient}>
                <NewsProvider>
                    <NewsGrid />
                </NewsProvider>
            </QueryClientProvider>
        </div>
    );
}
