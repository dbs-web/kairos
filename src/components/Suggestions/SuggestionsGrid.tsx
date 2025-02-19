'use client';
import { useEffect } from 'react';

// Hooks
import { useSuggestions } from '@/hooks/use-suggestions';
import { useToast } from '@/hooks/use-toast';
import { useSearchData } from '@/hooks/use-search-data';

// UI
import SuggestionCard from './SuggestionCard';
import Skeleton from './SuggestionSkeleton';
import Pagination from '../ui/pagination';

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
        sendToProduction,
        archiveSuggestions,
        page,
        setPage,
        totalPages,
        isLoading,
    } = useSuggestions();
    const { setStatuses } = useSearchData();

    const { toast } = useToast();

    useEffect(() => {
        setStatuses(enumStatuses);
    }, [suggestions]);

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

    return (
        <div
            className="flex h-full w-full flex-col items-center justify-between pb-[90px] transition-all duration-300"
            data-selection={selectedSuggestions?.length > 0}
        >
            <div className="grid w-full grid-cols-1 grid-rows-3 gap-4 !pt-0 md:grid-cols-2 xl:max-h-[650px] xl:grid-cols-3 2xl:grid-cols-4">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, index) => (
                          <Skeleton key={`skeleton-${index}`} />
                      ))
                    : suggestions.map((suggestion: ISuggestion) => (
                          <SuggestionCard
                              suggestion={suggestion}
                              key={suggestion.id}
                              isSelected={selectedSuggestions.includes(suggestion.id)}
                              onSelect={toggleSelectSuggestion}
                          />
                      ))}
            </div>

            <div className="flex w-full flex-col items-center justify-center">
                <Pagination page={page} totalPages={totalPages} setPage={setPage} />

                <div className="flex w-full items-center justify-center gap-x-4">
                    <button
                        className="rounded bg-green-500 px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-neutral-300"
                        onClick={handleSendToProduction}
                        disabled={selectedSuggestions?.length == 0}
                    >
                        Enviar para Produção
                    </button>
                    <button
                        className="rounded bg-red-500 px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-neutral-300"
                        onClick={handleArchive}
                        disabled={selectedSuggestions?.length == 0}
                    >
                        Deletar
                    </button>
                </div>
            </div>
        </div>
    );
}
