'use client';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Hooks
import { useSuggestions } from '@/hooks/use-suggestions';
import { useToast } from '@/hooks/use-toast';
import { useSearchData } from '@/hooks/use-search-data';

// UI
import SuggestionCard from './SuggestionCard';
import SuggestionApproachDialog from './SuggestionApproachDialog';
import Skeleton from './SuggestionSkeleton';
import Pagination from '../ui/pagination';
import Calendar from '../News/Calendar';
import CustomPrompt from '../CustomPrompt/CustomPrompt';
import { MdSend } from 'react-icons/md';

// Entities
import { ISuggestion } from '@/domain/entities/suggestion';

const enumStatuses = [
    { label: 'Em Análise', value: 'EM_ANALISE' },
    { label: 'Em produção', value: 'EM_PRODUCAO' },
    { label: 'Aprovado', value: 'APROVADO' },
    { label: 'Arquivado', value: 'ARQUIVADO' },
];

export default function SuggestionsGrid() {
    const {
        suggestions,
        page,
        setPage,
        totalPages,
        isLoading,
    } = useSuggestions();
    const { setStatuses } = useSearchData();
    const queryClient = useQueryClient();

    const { toast } = useToast();

    const [approachDialog, setApproachDialog] = useState<{
        open: boolean;
        suggestion: ISuggestion | null;
        preselectedStance?: 'APOIAR' | 'REFUTAR';
    }>({ open: false, suggestion: null });

    useEffect(() => {
        setStatuses(enumStatuses);
    }, []);



    const handleApproachClick = (suggestion: ISuggestion, preselectedStance?: 'APOIAR' | 'REFUTAR') => {
        setApproachDialog({ open: true, suggestion, preselectedStance });
    };

    const handleApproachDialogClose = () => {
        setApproachDialog({ open: false, suggestion: null });
    };

    const handleSendToProduction = async (suggestionId: number, approach: string, stance?: 'APOIAR' | 'REFUTAR') => {
        // Create a single suggestion payload and send directly to production
        const payload = {
            suggestions: [suggestionId],
            approaches: {
                [suggestionId]: { approach, stance }
            }
        };

        const response = await fetch('/api/sugestoes/aprovar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar para produção');
        }

        // Refresh the suggestions list
        queryClient.invalidateQueries({ queryKey: ['suggestions'] });

        setApproachDialog({ open: false, suggestion: null });
    };

    return (
        <div className="relative h-full w-full">
            {/* Layout principal - grid de 4 colunas */}
            <div className="grid grid-cols-1 gap-6 px-6 lg:grid-cols-12">
                {/* Coluna principal - sugestões */}
                <div className="lg:col-span-9">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {!isLoading &&
                            suggestions.map((suggestion: ISuggestion) => (
                                <SuggestionCard
                                    key={suggestion.id}
                                    suggestion={suggestion}
                                    onApproachClick={handleApproachClick}
                                />
                            ))}

                        {isLoading &&
                            Array.from({ length: 6 }).map((_, index) => (
                                <Skeleton key={`suggestion-skeleton-${index}`} />
                            ))}
                    </div>

                    {/* Paginação abaixo das notícias */}
                    <div className="mt-6 flex justify-center">
                        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                    </div>
                </div>

                {/* Coluna lateral direita - igual a NewsGrid */}
                <div className="flex flex-col space-y-6 lg:col-span-3">
                    {/* Criação de vídeo */}
                    <CustomPrompt />

                    {/* Calendário */}
                    <Calendar />
                </div>
            </div>



            {/* Approach Dialog */}
            {approachDialog.suggestion && (
                <SuggestionApproachDialog
                    suggestion={approachDialog.suggestion}
                    open={approachDialog.open}
                    onOpenChange={handleApproachDialogClose}
                    onSendToProduction={handleSendToProduction}
                    initialApproach={''}
                    initialStance={approachDialog.preselectedStance}
                />
            )}
        </div>
    );
}
