'use client';

import { ISuggestion } from '@/domain/suggestion';
import StatusBadge from '../ui/status-badge';
import { Status } from '@/domain/entities/status';

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
            className={`data-[disabled:true]:cursor-not-allowed relative me-4 w-full cursor-pointer rounded-lg border bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm data-[selected=true]:border data-[selected=true]:border-primary data-[selected=true]:shadow-md data-[selected=true]:shadow-primary/70`}
            data-selected={isSelected}
            onClick={handleSelect}
            data-disabled={suggestion.status !== Status.EM_ANALISE}
        >
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center justify-center gap-x-2">
                    <div className="h-12 w-12 rounded-lg bg-primary"></div>
                    <div className="flex flex-col items-start">
                        <h3 className="text-start font-medium text-neutral-700">
                            {suggestion.title}
                        </h3>
                        <span className="text-sm text-neutral-500">
                            Data: {new Date(suggestion.date).toLocaleDateString('pt-br')}
                        </span>
                    </div>
                </div>
                <StatusBadge status={suggestion.status} />
            </div>
            <p className="mt-4 line-clamp-4 text-sm text-neutral-500">{suggestion.briefing}</p>
        </div>
    );
}
