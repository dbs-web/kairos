'use client';
// UI
import StatusBadge from '../ui/status-badge';
import { MdLightbulb } from 'react-icons/md';

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
        if (suggestion.status === 'EM_ANALISE') {
            onSelect(suggestion.id);
        }
    };

    return (
        <div
            className={`relative h-full w-full cursor-pointer rounded-lg bg-card p-4 transition-all duration-300 ${
                suggestion.status === 'EM_ANALISE'
                    ? 'card-glow hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/10'
                    : 'cursor-not-allowed opacity-75'
            } ${isSelected ? 'card-glow selected' : ''}`}
            onClick={handleSelect}
        >
            <>
                <div
                    className={`absolute inset-0 rounded-lg transition-all duration-100 ${
                        isSelected ? 'border-2 border-primary' : 'border border-border'
                    }`}
                />
                {isSelected && (
                    <>
                        <div className="absolute left-0 top-0 h-8 w-8 rounded-tl-lg border-l-2 border-t-2 border-primary" />
                        <div className="absolute bottom-0 right-0 h-8 w-8 rounded-br-lg border-b-2 border-r-2 border-primary" />
                    </>
                )}
            </>

            <div className="relative flex h-full flex-col">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center justify-center gap-x-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                            <MdLightbulb className="text-2xl" />
                        </div>
                        <div className="flex flex-col items-start">
                            <h3 className="line-clamp-1 text-lg font-semibold text-foreground">
                                {suggestion.title}
                            </h3>
                            <time className="block text-xs font-medium text-muted-foreground">
                                {new Date(suggestion.date).toLocaleDateString('pt-br')}
                            </time>
                        </div>
                    </div>
                    <StatusBadge status={suggestion.status} />
                </div>
                <p className="mt-4 line-clamp-4 flex-grow text-sm leading-relaxed text-foreground/80">
                    {suggestion.briefing}
                </p>
            </div>
        </div>
    );
}
