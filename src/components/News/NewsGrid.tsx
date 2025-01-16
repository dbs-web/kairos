'use client';

import NewsCard from './NewsCard';
import { INews } from '@/types/news';
import { useDataFilter } from '@/hooks/use-data-filter';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNews } from '@/hooks/use-news';

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
    const { news, selectedNews, toggleSelectNews, sendToProduction } = useNews();
    const { toast } = useToast();
    const { filteredData, setInitialData, setStatuses } = useDataFilter();

    useEffect(() => {
        setStatuses(statuses);
        setInitialData(news);
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
            <div className="flex flex-wrap gap-y-8 p-8 !pt-0">
                {filteredData.map((news: INews) => (
                    <div className="basis-1/1 sm:basis-1/2 md:basis-1/3 xl:basis-1/4" key={news.id}>
                        <NewsCard
                            news={news}
                            isSelected={selectedNews.includes(news.id)}
                            onSelect={toggleSelectNews}
                        />
                    </div>
                ))}
            </div>
            {selectedNews.length > 0 && (
                <button
                    className="hover:bg-primary-600 fixed bottom-4 right-1/2 translate-x-1/2 rounded bg-primary px-4 py-2 text-white transition-all duration-300 hover:scale-105"
                    onClick={handleSubmit}
                >
                    Enviar para Produção
                </button>
            )}
        </div>
    );
}
