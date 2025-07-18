import { INews } from '@/domain/entities/news';
import { INewsService } from '@/services/NewsService';

export default class CreateManyNewsUseCase {
    private newsService: INewsService;

    constructor(newsService: INewsService) {
        this.newsService = newsService;
    }

    async execute({ newsDataArr, userId }: { newsDataArr: Omit<INews, 'id'>[]; userId: number }) {
        return this.newsService.createManyWithDuplicateCheck(newsDataArr, userId);
    }
}
