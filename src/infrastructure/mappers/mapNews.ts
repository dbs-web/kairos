import { News as PrismaNews } from '@prisma/client';
import { INews } from '@/domain/entities/news';
import { mapStatus } from './mapStatus';

export function mapNews(prismaNews: PrismaNews): INews {
    const { id, title, text, url, summary, thumbnail, date, status, userId } = prismaNews;
    return { id, title, text, url, summary, thumbnail, date, status: mapStatus(status), userId };
}
