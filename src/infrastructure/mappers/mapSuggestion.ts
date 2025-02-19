import { Suggestion as PrismaSuggestion } from '@prisma/client';
import { mapStatus } from './mapStatus';

// Entities
import { ISuggestion } from '@/domain/entities/suggestion';

export function mapSuggestion(prismaSuggestion: PrismaSuggestion): ISuggestion {
    const { id, title, date, briefing, userId, status } = prismaSuggestion;
    return { id, title, date, briefing, userId, status: mapStatus(status) };
}
