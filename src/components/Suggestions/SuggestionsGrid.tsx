import { ISuggestion } from '@/types/suggestion';
import SuggestionCard from './SuggestionCard';

interface SuggestionGridProps {
    suggestions: ISuggestion[];
}

export default function SuggestionsGrid({ suggestions }: SuggestionGridProps) {
    return (
        <div className="grid grid-cols-3 grid-rows-3 gap-4 p-4">
            {suggestions?.length > 0 &&
                suggestions.map((suggestion) => (
                    <SuggestionCard suggestion={suggestion} key={suggestion._id} />
                ))}
        </div>
    );
}
