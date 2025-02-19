import { INews } from '@/domain/entities/news';
import { INewsService } from '@/services/NewsService';

export default class CreateManyNewsUseCase {
    private newsService: INewsService;

    constructor(newsService: INewsService) {
        this.newsService = newsService;
    }

    async execute({ newsDataArr }: { newsDataArr: Omit<INews, 'id'>[] }) {
        return this.newsService.createMany(newsDataArr);
    }
}
