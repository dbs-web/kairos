import { fetchSuggestions } from '@/actions/fetchSuggestions';
import SuggestionsGrid from '@/components/Suggestions/SuggestionsGrid';

export default async function Sugestoes() {
    const suggestions = await fetchSuggestions();

    return (
        <div className="flex w-full flex-col items-center">
            <SuggestionsGrid suggestions={suggestions} />
        </div>
    );
}
