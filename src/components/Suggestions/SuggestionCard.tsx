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
    arquivado: 'Arquivado',
};

export default function SuggestionCard({ suggestion, isSelected, onSelect }: SuggestionCardProps) {
    const badgeColor = {
        aprovado: '#00aa00f0',
        arquivado: '#aa0000f0',
        'em-analise': '#e5e5e5',
        'em-producao': '#0085a3f0',
    };

    const handleSelect = () => {
        if (suggestion.status === 'em-analise') {
            onSelect(suggestion._id);
        }
    };

    return (
        <div
            className={`relative cursor-pointer rounded-lg border bg-white p-5 transition-all duration-300 ${
                suggestion.status === 'em-analise'
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
                            Data: {suggestion?.date?.toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-x-2">
                    <span
                        className="rounded p-2 text-xs font-medium"
                        style={{
                            backgroundColor: badgeColor[suggestion.status],
                            color: suggestion.status === 'em-analise' ? '#939393' : '#fff',
                        }}
                    >
                        {statusEnum[suggestion.status]}
                    </span>
                </div>
            </div>
            <p className="mt-4 line-clamp-4 text-neutral-500">{suggestion.briefing}</p>
        </div>
    );
}
