import { ISuggestion } from '@/types/suggestion';

interface SuggestionCardProps {
    suggestion: ISuggestion;
}

export default function SuggestionCard({ suggestion }: SuggestionCardProps) {
    return (
        <div className="cursor-pointer rounded-lg border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-center text-lg font-bold">{suggestion.title}</h3>
            <p className="mt-8 line-clamp-6 text-neutral-500">{suggestion.briefing}</p>
        </div>
    );
}
