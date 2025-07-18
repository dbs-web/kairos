'use client';

import NewsCard from './NewsCard';
import NewsApproachDialog from './NewsApproachDialog';
import { INews } from '@/domain/entities/news';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNews } from '@/hooks/use-news';
import { useSearchData } from '@/hooks/use-search-data';
import Pagination from '../ui/pagination';
import NewsSkeleton from './NewsSkeleton';
import CustomPrompt from '../CustomPrompt/CustomPrompt';
import { MdSend, MdMovie, MdVideocam, MdOutlineArrowUpward } from 'react-icons/md';

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
        saveNewsApproach,
        getNewsApproach,
        hasApproach,
        sendToProduction,
        page,
        setPage,
        totalPages,
    } = useNews();
    const { toast } = useToast();
    const { setStatuses } = useSearchData();

    const [approachDialog, setApproachDialog] = useState<{
        open: boolean;
        news: INews | null;
    }>({ open: false, news: null });

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

    const handleApproachClick = (news: INews) => {
        setApproachDialog({ open: true, news });
    };

    const handleApproachSave = (newsId: number, approach: string) => {
        saveNewsApproach(newsId, approach);
        setApproachDialog({ open: false, news: null });
    };

    const handleApproachDialogClose = () => {
        setApproachDialog({ open: false, news: null });
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
                                    hasApproach={hasApproach(news.id)}
                                    onSelect={toggleSelectNews}
                                    onApproachClick={handleApproachClick}
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

            {/* Botão flutuante aprimorado para enviar para produção */}
            {selectedNews.length > 0 && (
                <div className="fixed bottom-4 left-0 right-0 z-50 flex items-center justify-center">
                    <div className="relative">
                        {/* Animation dots - arrow pointing DOWN */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                            <MdOutlineArrowUpward className="animate-bounce-arrow text-2xl text-primary" />
                        </div>

                        {/* Main button container */}
                        <div className="rounded-full border border-primary/30 bg-card px-4 py-3 shadow-lg shadow-primary/20">
                            <button
                                onClick={handleSubmit}
                                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0085A3] to-primary px-6 py-3 font-medium text-card-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                            >
                                <MdSend className="text-lg transition-transform group-hover:translate-x-1" />
                                <span>Enviar para Produção</span>
                            </button>
                        </div>

                        {/* Number of selected items badge */}
                        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                            {selectedNews.length}
                        </div>
                    </div>
                </div>
            )}

            {/* Approach Dialog */}
            {approachDialog.news && (
                <NewsApproachDialog
                    news={approachDialog.news}
                    open={approachDialog.open}
                    onOpenChange={handleApproachDialogClose}
                    onSave={handleApproachSave}
                    initialApproach={getNewsApproach(approachDialog.news.id) || ''}
                />
            )}
        </div>
    );
}
