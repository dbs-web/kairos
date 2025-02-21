'use client';
// UI
import StatusBadge from '../ui/status-badge';

// Entities
import { ISuggestion } from '@/domain/entities/suggestion';
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
            className={`data-[disabled:true]:cursor-not-allowed relative me-4 w-full cursor-pointer rounded-lg bg-white p-5 [transition:transform_300ms,box-shadow_300ms] ${
                suggestion.status === 'EM_ANALISE'
                    ? 'hover:-translate-y-2 hover:shadow-[0px_4px_6px_-2px_rgba(16,24,40,0.03),0px_12px_16px_-4px_rgba(16,24,40,0.08)]'
                    : 'cursor-not-allowed'
            }`}
            onClick={handleSelect}
            data-disabled={suggestion.status !== Status.EM_ANALISE}
        >
            <div
                className={`absolute inset-0 rounded-lg border transition-all duration-100 ${isSelected ? 'border-2 border-primary' : 'border border-neutral-200'}`}
            />

            <div className="relative">
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
        </div>
    );
}
