'use client';

import { ISuggestion } from '@/types/suggestion';

interface SuggestionCardProps {
    suggestion: ISuggestion;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

const statusEnum = {
    'em-analise': 'Em análise',
    'em-producao': 'Em produção',
    aprovado: 'Aprovado',
    rejeitado: 'Rejeitado',
};

export default function SuggestionCard({ suggestion, isSelected, onSelect }: SuggestionCardProps) {
    return (
        <div
            className={`relative cursor-pointer rounded-lg border bg-white p-5 transition-all duration-300 ${
                isSelected
                    ? 'border border-primary/50 shadow-md shadow-primary/70'
                    : 'hover:-translate-y-1 hover:shadow-sm'
            }`}
            onClick={() => onSelect(suggestion._id)}
        >
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center justify-center gap-x-2">
                    <div className="h-12 w-12 rounded-lg bg-primary"></div>
                    <div className="flex flex-col items-start">
                        <h3 className="text-center font-medium text-neutral-700">
                            {suggestion.title}
                        </h3>
                        <span className="text-sm text-neutral-500">
                            Data: {suggestion?.date?.toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-x-2">
                    <span className="rounded bg-neutral-200 p-2 text-xs font-medium text-neutral-400">
                        {statusEnum[suggestion.status]}
                    </span>
                </div>
            </div>
            <p className="mt-4 line-clamp-4 text-neutral-500">{suggestion.briefing}</p>
        </div>
    );
}
