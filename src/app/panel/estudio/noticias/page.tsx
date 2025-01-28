'use client';
import NewsGrid from '@/components/News/NewsGrid';
import { NewsProvider } from '@/hooks/use-news';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Calendar from '@/components/News/Calendar';

const queryClient = new QueryClient();

export default function Sugestoes() {
    return (
        <div className="grid w-full grid-cols-[1fr_0.5fr] grid-rows-1 items-start !overflow-x-hidden">
            <QueryClientProvider client={queryClient}>
                <NewsProvider>
                    <NewsGrid />
                </NewsProvider>
                <Calendar />
            </QueryClientProvider>
        </div>
    );
}
