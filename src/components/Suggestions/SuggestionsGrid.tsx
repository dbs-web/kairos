// SuggestionsGrid.tsx
'use client';

import { useSuggestions } from '@/hooks/use-suggestions';
import SuggestionCard from './SuggestionCard';
import { ISuggestion } from '@/types/suggestion';
import { useDataFilter } from '@/hooks/use-data-filter';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Skeleton from './SuggestionSkeleton';

const statuses = [
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
    const { toast } = useToast();
    const { filteredData, setInitialData, setStatuses } = useDataFilter();

    useEffect(() => {
        setStatuses(statuses);
        setInitialData(suggestions);
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

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div
            className="relative grid h-full w-full grid-cols-1 grid-rows-[1fr_48px_72px] justify-between transition-all duration-300"
            data-selection={selectedSuggestions?.length > 0}
        >
            <div className="grid grid-cols-1 grid-rows-4 gap-4 !pt-0 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, index) => (
                          <Skeleton key={`skeleton-${index}`} />
                      ))
                    : filteredData.map((suggestion: ISuggestion) => (
                          <SuggestionCard
                              suggestion={suggestion}
                              key={suggestion.id}
                              isSelected={selectedSuggestions.includes(suggestion.id)}
                              onSelect={toggleSelectSuggestion}
                          />
                      ))}
            </div>

            <div className="mb-8 flex items-center justify-center space-x-4">
                <button
                    className="rounded bg-gray-200 px-3 py-2 hover:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                >
                    Anterior
                </button>
                <span>
                    Página {page} de {totalPages}
                </span>
                <button
                    className="rounded bg-gray-200 px-3 py-2 hover:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                >
                    Próxima
                </button>
            </div>

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
    );
}
