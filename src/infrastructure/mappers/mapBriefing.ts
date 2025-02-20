import { Briefing as PrismaBriefing } from '@prisma/client';
import { IBriefing, Source } from '@/domain/entities/briefing';
import { mapStatus } from './mapStatus';
import mapSource from './mapSource';

export function mapBriefing(prismaBriefing: PrismaBriefing): IBriefing {
    const { id, suggestionId, newsId, title, text, date, status, userId, sources } = prismaBriefing;

    return {
        id,
        suggestionId,
        newsId,
        title,
        text,
        date,
        status: mapStatus(status),
        userId,
        sources: mapSource(sources),
    };
}
