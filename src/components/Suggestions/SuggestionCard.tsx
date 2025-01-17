'use client';

import { ISuggestion } from '@/types/suggestion';
import StatusBadge from '../ui/status-badge';
import { Status } from '@/types/status';
import { useSuggestions } from '@/hooks/use-suggestions';
import { FaArchive } from 'react-icons/fa'; // Usando react-icons para o ícone de arquivar

interface SuggestionCardProps {
    suggestion: ISuggestion;
    isSelected: boolean;
    onSelect: (id: number) => void;
}

export default function SuggestionCard({ suggestion, isSelected, onSelect }: SuggestionCardProps) {
    const handleSelect = () => {
        onSelect(suggestion.id);
    };

    return (
        <div
            className={`relative me-4 w-full cursor-pointer rounded-lg border bg-white p-5 transition-all duration-300 ${
                suggestion.status === Status.EM_ANALISE
                    ? isSelected
                        ? 'border border-primary/50 shadow-md shadow-primary/70'
                        : 'hover:-translate-y-1 hover:shadow-sm'
                    : 'cursor-not-allowed'
            }`}
            onClick={handleSelect}
        >
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center justify-center gap-x-2">
                    <div className="h-12 w-12 rounded-lg bg-primary"></div>
                    <div className="flex flex-col items-start">
                        <h3 className="text-center font-medium text-neutral-700">
                            {suggestion.title}
                        </h3>
                        <span className="text-sm text-neutral-500">
                            Data: {new Date(suggestion.date).toLocaleDateString('pt-br')}
                        </span>
                    </div>
                </div>
                <StatusBadge status={suggestion.status} />
            </div>
            <p className="mt-4 line-clamp-4 text-neutral-500">{suggestion.briefing}</p>
        </div>
    );
}
