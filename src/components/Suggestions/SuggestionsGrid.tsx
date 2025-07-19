'use client';
import { useEffect, useState } from 'react';

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
import { MdSend, MdOutlineArrowUpward, MdOutlineArchive } from 'react-icons/md';

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
        selectedSuggestions,
        toggleSelectSuggestion,
        saveSuggestionApproach,
        getSuggestionApproach,
        hasApproach,
        sendToProduction,
        archiveSuggestions,
        page,
        setPage,
        totalPages,
        isLoading,
    } = useSuggestions();
    const { setStatuses } = useSearchData();

    const { toast } = useToast();

    const [approachDialog, setApproachDialog] = useState<{
        open: boolean;
        suggestion: ISuggestion | null;
        preselectedStance?: 'APOIAR' | 'REFUTAR';
    }>({ open: false, suggestion: null });

    useEffect(() => {
        setStatuses(enumStatuses);
    }, []);

    const handleSendToProduction = async () => {
        try {
            await sendToProduction();
            toast({
                title: 'Sugestão aprovada com sucesso!',
                description:
                    "O briefing para seu vídeo será gerado e enviado para você na aba de 'Aprovações'",
            });
        } catch (error) {
            toast({
                title: 'Erro ao enviar para produção',
                description: 'Houve um problema ao aprovar as sugestões selecionadas.',
                variant: 'destructive',
            });
        }
    };

    const handleArchive = async () => {
        try {
            await archiveSuggestions();
            toast({
                title: 'Sugestões arquivadas com sucesso!',
                description:
                    'As sugestões selecionadas foram arquivadas e não serão mais exibidas.',
            });
        } catch (error) {
            toast({
                title: 'Erro ao arquivar sugestões',
                description: 'Houve um problema ao arquivar as sugestões selecionadas.',
                variant: 'destructive',
            });
        }
    };

    const handleApproachClick = (suggestion: ISuggestion, preselectedStance?: 'APOIAR' | 'REFUTAR') => {
        setApproachDialog({ open: true, suggestion, preselectedStance });
    };

    const handleApproachDialogClose = () => {
        setApproachDialog({ open: false, suggestion: null });
    };

    const handleApproachSave = (suggestionId: number, approach: string, stance?: 'APOIAR' | 'REFUTAR') => {
        saveSuggestionApproach(suggestionId, approach, stance);
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
                                    isSelected={selectedSuggestions.includes(suggestion.id)}
                                    hasApproach={hasApproach(suggestion.id)}
                                    savedStance={getSuggestionApproach(suggestion.id)?.stance}
                                    onSelect={toggleSelectSuggestion}
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

            {/* Botão flutuante aprimorado para enviar para produção */}
            {selectedSuggestions.length > 0 && (
                <div className="fixed bottom-4 left-0 right-0 z-50 flex items-center justify-center">
                    <div className="relative">
                        {/* Animation dots - arrow pointing DOWN */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                            <MdOutlineArrowUpward className="animate-bounce-arrow text-2xl text-primary" />
                        </div>

                        {/* Main button container */}
                        <div className="rounded-full border border-primary/30 bg-card px-4 py-3 shadow-lg shadow-primary/20">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleSendToProduction}
                                    className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0085A3] to-primary px-6 py-3 font-medium text-card-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                                >
                                    <MdSend className="text-lg transition-transform group-hover:translate-x-1" />
                                    <span>Enviar para Produção</span>
                                </button>

                                <button
                                    onClick={handleArchive}
                                    className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-destructive/80 to-destructive px-6 py-3 font-medium text-card-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-destructive/30"
                                >
                                    <MdOutlineArchive className="text-lg transition-transform group-hover:translate-y-0.5" />
                                    <span>Arquivar</span>
                                </button>
                            </div>
                        </div>

                        {/* Number of selected items badge */}
                        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                            {selectedSuggestions.length}
                        </div>
                    </div>
                </div>
            )}

            {/* Approach Dialog */}
            {approachDialog.suggestion && (
                <SuggestionApproachDialog
                    suggestion={approachDialog.suggestion}
                    open={approachDialog.open}
                    onOpenChange={handleApproachDialogClose}
                    onSave={handleApproachSave}
                    initialApproach={getSuggestionApproach(approachDialog.suggestion.id)?.approach || ''}
                    initialStance={approachDialog.preselectedStance || getSuggestionApproach(approachDialog.suggestion.id)?.stance}
                />
            )}
        </div>
    );
}
