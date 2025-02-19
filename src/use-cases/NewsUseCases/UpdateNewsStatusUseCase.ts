import { INews } from '@/domain/entities/news';
import { Status } from '@/domain/entities/status';
import INewsService from '@/services/NewsService';

export default class UpdateNewsStatusUseCase {
    private newsService: INewsService;
    constructor(newsService: INewsService) {
        this.newsService = newsService;
    }

    async execute({
        news,
        userId,
        status,
    }: {
        news: number[];
        userId: number;
        status: Status;
    }): Promise<INews[]> {
        const newsToUpdate: Partial<INews> & { id: number }[] = news.map((n) => ({
            id: n,
            status,
        }));

        const updatedNews = await this.newsService.updateMany({ dataArr: newsToUpdate, userId });
        return updatedNews.filter(function (el) {
            return el !== undefined;
        });
    }
}
