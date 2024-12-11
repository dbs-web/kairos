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
            className={`relative cursor-pointer rounded-lg border p-4 transition-all duration-300 ${
                isSelected
                    ? 'border-2 border-primary shadow-md'
                    : 'hover:-translate-y-1 hover:shadow-sm'
            }`}
            onClick={() => onSelect(suggestion._id)}
        >
            <h3 className="text-center text-lg font-bold">{suggestion.title}</h3>
            <p className="mt-4 line-clamp-3 text-neutral-500">{suggestion.briefing}</p>
            <span className="absolute top-4 rounded bg-neutral-400 p-2 text-xs text-white">
                {statusEnum[suggestion.status]}
            </span>
        </div>
    );
}
