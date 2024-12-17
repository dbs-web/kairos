'use client';

import { useSuggestions } from '@/hooks/use-suggestions';
import SuggestionCard from './SuggestionCard';
import { ISuggestion } from '@/types/suggestion';
import { useDataFilter } from '@/hooks/use-data-filter';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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

export default function SuggestionsGrid() {
    const { suggestions, selectedSuggestions, toggleSelectSuggestion, sendToProduction } =
        useSuggestions();

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
    return (
        <div className="relative h-full w-full">
            <div className="grid grid-cols-4 gap-4">
                {filteredData.map((suggestion: ISuggestion) => (
                    <SuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        isSelected={selectedSuggestions.includes(suggestion.id)}
                        onSelect={toggleSelectSuggestion}
                    />
                ))}
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
