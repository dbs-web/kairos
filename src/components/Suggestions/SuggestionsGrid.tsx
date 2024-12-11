'use client';

import { useSuggestions } from '@/hooks/use-suggestions';
import SuggestionCard from './SuggestionCard';
import { ISuggestion } from '@/types/suggestion';

export default function SuggestionsGrid() {
    const { filteredSuggestions, selectedSuggestions, toggleSelectSuggestion, sendToProduction } =
        useSuggestions();

    return (
        <div className="relative h-full w-full">
            <div className="grid grid-cols-3 gap-4">
                {filteredSuggestions.map((suggestion: ISuggestion) => (
                    <SuggestionCard
                        key={suggestion._id}
                        suggestion={suggestion}
                        isSelected={selectedSuggestions.includes(suggestion._id)}
                        onSelect={toggleSelectSuggestion}
                    />
                ))}
            </div>
            {selectedSuggestions.length > 0 && (
                <button
                    className="hover:bg-primary-600 fixed bottom-4 right-1/2 translate-x-1/2 rounded bg-primary px-4 py-2 text-white transition-all duration-300 hover:scale-105"
                    onClick={sendToProduction}
                >
                    Enviar para Produção
                </button>
            )}
        </div>
    );
}
