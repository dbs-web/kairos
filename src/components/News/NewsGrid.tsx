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

    const handleApproachClick = (news: INews) => {
        setApproachDialog({ open: true, news });
    };

    const handleSendToProduction = async (newsId: number, approach: string) => {
        // Create a single news payload and send directly to production
        const payload = {
            news: [newsId],
            approaches: {
                [newsId]: approach
            }
        };

        const response = await fetch('/api/news/aprovar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar para produção');
        }

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



            {/* Approach Dialog */}
            {approachDialog.news && (
                <NewsApproachDialog
                    news={approachDialog.news}
                    open={approachDialog.open}
                    onOpenChange={handleApproachDialogClose}
                    onSendToProduction={handleSendToProduction}
                    initialApproach=""
                />
            )}
        </div>
    );
}
