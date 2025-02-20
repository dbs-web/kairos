'use client';
import NewsGrid from '@/components/News/NewsGrid';
import { NewsProvider } from '@/hooks/use-news';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Calendar from '@/components/News/Calendar';
import CustomPrompt from '@/components/News/CustomPrompt';

const queryClient = new QueryClient();

export default function Sugestoes() {
    return (
        <div className="grid h-full w-full grid-cols-[1fr_0.5fr] grid-rows-1 items-start !overflow-x-hidden">
            <QueryClientProvider client={queryClient}>
                <NewsProvider>
                    <NewsGrid />
                </NewsProvider>
                <div className="flex w-full flex-col gap-y-8">
                    <Calendar />
                    <CustomPrompt />
                </div>
            </QueryClientProvider>
        </div>
    );
}
