import { ISuggestion } from '@/domain/suggestion';
import { Suggestion as PrismaSuggestion } from '@prisma/client';
import { mapStatus } from './mapStatus';

export function mapSuggestion(prismaSuggestion: PrismaSuggestion): ISuggestion {
    const { id, title, date, briefing, userId, status } = prismaSuggestion;
    return { id, title, date, briefing, userId, status: mapStatus(status) };
}
