import { Status } from '@/domain/entities/status';
import { INewsService } from '@/services/NewsService';

export default class GetPaginatedNewsUseCase {
    private newsService: INewsService;

    constructor(newsService: INewsService) {
        this.newsService = newsService;
    }

    async execute({
        userId,
        statuses,
        search,
        skip,
        limit,
    }: {
        userId: number;
        statuses: Status[];
        search: string;
        skip: number;
        limit: number;
    }) {
        return this.newsService.findWithQueryAndPagination({
            userId,
            statuses,
            query: search,
            skip,
            take: limit,
        });
    }
}
