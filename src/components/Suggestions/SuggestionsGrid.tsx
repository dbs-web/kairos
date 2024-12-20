'use client';

import { useSuggestions } from '@/hooks/use-suggestions';
import SuggestionCard from './SuggestionCard';
import { ISuggestion } from '@/types/suggestion';
import { useDataFilter } from '@/hooks/use-data-filter';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const statuses = [
    { label: 'Em Análise', value: 'EM_ANALISE' },
    { label: 'Em produção', value: 'EM_PRODUCAO' },
    { label: 'Aprovado', value: 'APROVADO' },
    { label: 'Arquivado', value: 'ARQUIVADO' },
];
import Skeleton from './SuggestionSkeleton';

export default function SuggestionsGrid() {
    const {
        suggestions,
        selectedSuggestions,
        toggleSelectSuggestion,
        sendToProduction,
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

    const handleSubmit = () => {
        sendToProduction();
        toast({
            title: 'Sugestão aprovada com sucesso!',
            description:
                "O briefing para seu vídeo será gerado e enviado para você na aba de 'Aprovações'",
        });
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div className="relative h-full w-full">
            <div className="grid grid-cols-1 gap-4 !pt-0 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, index) => (
                          <div className="me-4" key={index}>
                              <Skeleton />
                          </div>
                      ))
                    : filteredData.map((suggestion: ISuggestion) => (
                          <div className="me-4" key={suggestion.id}>
                              <SuggestionCard
                                  suggestion={suggestion}
                                  isSelected={selectedSuggestions.includes(suggestion.id)}
                                  onSelect={toggleSelectSuggestion}
                              />
                          </div>
                      ))}
            </div>

            <div className="mt-4 flex items-center justify-center space-x-4">
                <button
                    className="rounded bg-gray-200 px-3 py-2 hover:bg-gray-300"
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                >
                    Anterior
                </button>
                <span>
                    Página {page} de {totalPages}
                </span>
                <button
                    className="rounded bg-gray-200 px-3 py-2 hover:bg-gray-300"
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                >
                    Próxima
                </button>
            </div>

            {selectedSuggestions.length > 0 && (
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
