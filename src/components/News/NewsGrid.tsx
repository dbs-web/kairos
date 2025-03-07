'use client';

import NewsCard from './NewsCard';
import { INews } from '@/domain/entities/news';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNews } from '@/hooks/use-news';
import { useSearchData } from '@/hooks/use-search-data';
import Pagination from '../ui/pagination';
import NewsSkeleton from './NewsSkeleton';
import CustomPrompt from '../CustomPrompt/CustomPrompt';

import Calendar from './Calendar';

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
    const {
        news,
        isLoading,
        selectedNews,
        toggleSelectNews,
        sendToProduction,
        page,
        setPage,
        totalPages,
    } = useNews();
    const { toast } = useToast();
    const { setStatuses } = useSearchData();

    useEffect(() => {
        setStatuses(statuses);
    }, []);

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
            {/* Layout principal - grid de 4 colunas */}
            <div className="grid grid-cols-1 gap-6 px-6 lg:grid-cols-12">
                {/* Coluna principal - notícias */}
                <div className="lg:col-span-9">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {!isLoading &&
                            news.map((news: INews) => (
                                <NewsCard
                                    key={news.id}
                                    news={news}
                                    isSelected={selectedNews.includes(news.id)}
                                    onSelect={toggleSelectNews}
                                />
                            ))}

                        {isLoading &&
                            Array.from({ length: 6 }).map((_, index) => (
                                <NewsSkeleton key={`news-skeleton-${index}`} />
                            ))}
                    </div>

                    {/* Paginação abaixo das notícias */}
                    <div className="mt-6 flex justify-center">
                        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                    </div>
                </div>

                {/* Coluna lateral direita */}
                <div className="flex flex-col space-y-6 lg:col-span-3">
                    {/* Criação de vídeo */}
                    <CustomPrompt />

                    {/* Calendário */}
                    <Calendar />
                </div>
            </div>

            {/* Botão flutuante para enviar para produção */}
            {selectedNews.length > 0 && (
                <div className="fixed bottom-4 left-0 right-0 flex justify-center">
                    <button
                        className="rounded bg-primary px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:bg-primary/90"
                        onClick={handleSubmit}
                    >
                        Enviar para Produção
                    </button>
                </div>
            )}
        </div>
    );
}
