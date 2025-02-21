'use client';

import NewsCard from './NewsCard';
import { INews } from '@/domain/entities/news';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNews } from '@/hooks/use-news';
import { useSearchData } from '@/hooks/use-search-data';
import Pagination from '../ui/pagination';

const statuses = [
    {
        label: 'Em Análise',
        value: 'EM_ANALISE',
    },
    {
        label: 'Em produção',
        value: 'EM_PRODUCAO',
    },
    {
        label: 'Aprovado',
        value: 'APROVADO',
    },
    {
        label: 'Arquivado',
        value: 'ARQUIVADO',
    },
];

export default function NewsGrid() {
    const { news, selectedNews, toggleSelectNews, sendToProduction, page, setPage, totalPages } =
        useNews();
    const { toast } = useToast();
    const { setStatuses } = useSearchData();
    useEffect(() => {
        setStatuses(statuses);
    }, [news]);

    const handleSubmit = () => {
        sendToProduction();
        toast({
            title: 'Notícia aprovada com sucesso!',
            description:
                "O briefing para seu vídeo será gerado e enviado para você na aba de 'Aprovações'",
        });
    };
    return (
        <div className="relative h-full w-full">
            {/* Added px-6 for consistent horizontal padding */}
            <div className="grid grid-cols-1 gap-6 px-6 !pt-0 pb-20 lg:grid-cols-2 2xl:grid-cols-3">
                {news.map((news: INews) => (
                    // Removed extra div wrapper to allow card to grow
                    <NewsCard
                        key={news.id}
                        news={news}
                        isSelected={selectedNews.includes(news.id)}
                        onSelect={toggleSelectNews}
                    />
                ))}
            </div>
            <div className="flex w-full flex-col items-center justify-center">
                <Pagination page={page} totalPages={totalPages} setPage={setPage} />

                {selectedNews.length > 0 && (
                    <button
                        className="hover:bg-primary-600 fixed bottom-4 right-1/2 translate-x-1/2 rounded bg-primary px-4 py-2 text-white transition-all duration-300 hover:scale-105"
                        onClick={handleSubmit}
                    >
                        Enviar para Produção
                    </button>
                )}
            </div>
        </div>
    );
}
