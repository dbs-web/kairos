import { INews } from '@/domain/entities/news';
import { INewsRepository } from '../repositories/NewsRepository';
import { FindPaginatedServiceArgs, IPaginatedDataService } from './PaginatedDataService';
import { ServiceError } from '@/shared/errors';

interface FindByIdArgs {
    id: number;
    userId: number;
}

interface UpdateVideoArgs {
    id: number;
    userId: number;
    data: Partial<INews>;
}

interface UpdateManyVideoArgs {
    dataArr: Partial<INews> & { id: number }[];
    userId: number;
}

interface DeleteVideoArgs {
    id: number;
    userId: number;
}

export interface INewsService extends IPaginatedDataService<INews> {
    findById: (args: FindByIdArgs) => Promise<INews>;
    findByIds: ({ ids }: { ids: number[] }) => Promise<INews[]>;
    createMany: (suggestionsDataArr: Omit<INews, 'id'>[]) => Promise<INews[]>;
    createManyWithDuplicateCheck: (newsDataArr: Omit<INews, 'id'>[], userId: number) => Promise<INews[]>;
    update: (args: UpdateVideoArgs) => Promise<INews>;
    deleteMany: ({ ids, userId }: { ids: number[]; userId: number }) => Promise<void>;
    updateMany: ({ dataArr, userId }: UpdateManyVideoArgs) => Promise<INews[]>;
}

export default class NewsService implements INewsService {
    private repository;

    constructor(newsRepository: INewsRepository) {
        this.repository = newsRepository;
    }

    async findById({ id }: FindByIdArgs): Promise<INews> {
        const news = await this.repository.findUnique({
            criteria: {
                id,
            },
        });

        if (!news) {
            throw new ServiceError('News with the provided id was not found');
        }

        return news;
    }

    async findByIds({ ids }: { ids: number[] }): Promise<INews[]> {
        return await this.repository.find({
            criteria: {
                id: {
                    in: ids,
                },
            },
        });
    }

    async findWithQueryAndPagination({
        userId,
        statuses,
        query,
        skip,
        take,
        orderBy,
    }: FindPaginatedServiceArgs): Promise<[INews[], number]> {
        const criteria = {
            userId,
            status: {
                in: statuses,
            },
            title: {
                contains: query,
            },
        };

        return Promise.all([
            this.repository.find({ criteria, skip, take, orderBy }),
            this.repository.count({ criteria }),
        ]);
    }

    async create(newsData: Omit<INews, 'id'>): Promise<INews> {
        return this.repository.create(newsData);
    }

    async createMany(newsDataArr: Omit<INews, 'id'>[]): Promise<INews[]> {
        return this.repository.createMany(newsDataArr);
    }

    async createManyWithDuplicateCheck(newsDataArr: Omit<INews, 'id'>[], userId: number): Promise<INews[]> {
        try {
            console.log('NewsService.createManyWithDuplicateCheck - Starting with', newsDataArr.length, 'items');

            // Import here to avoid circular dependency
            const { generateNewsContentHash, filterDuplicateNews } = await import('@/utils/duplicateDetection');
            console.log('NewsService.createManyWithDuplicateCheck - Imported duplicate detection utils');

            // Generate hashes for all new news items
            const newContentHashes = newsDataArr.map(news => generateNewsContentHash(news));
            console.log('NewsService.createManyWithDuplicateCheck - Generated', newContentHashes.length, 'hashes');

            // Check which hashes already exist in the database
            const existingHashes = await this.repository.findExistingContentHashes(userId, newContentHashes);
            console.log('NewsService.createManyWithDuplicateCheck - Found', existingHashes.size, 'existing hashes');

            // Filter out duplicates
            const filteredNews = filterDuplicateNews(newsDataArr, existingHashes);
            console.log('NewsService.createManyWithDuplicateCheck - Filtered to', filteredNews.length, 'unique items');

            // Create only the non-duplicate news
            if (filteredNews.length === 0) {
                console.log('NewsService.createManyWithDuplicateCheck - No items to create');
                return [];
            }

            const result = await this.repository.createMany(filteredNews);
            console.log('NewsService.createManyWithDuplicateCheck - Created', result.length, 'items');
            return result;
        } catch (error) {
            console.error('Error in createManyWithDuplicateCheck:', error);
            // Fallback to regular creation without duplicate checking
            console.log('Falling back to regular createMany without duplicate checking');
            return this.repository.createMany(newsDataArr);
        }
    }

    async update({ id, userId, data }: UpdateVideoArgs): Promise<INews> {
        const news = await this.repository.update({
            criteria: {
                id,
                userId,
            },
            data,
        });

        if (!news) {
            throw new ServiceError(
                'News with the provided id and user_id was not found, failed to update.',
            );
        }

        return news;
    }

    async updateMany({ dataArr, userId }: UpdateManyVideoArgs): Promise<INews[]> {
        return await Promise.all(
            dataArr.map((news) => this.update({ id: news?.id, userId, data: news })),
        );
    }

    async delete({ id, userId }: DeleteVideoArgs): Promise<INews> {
        const news = await this.repository.delete({
            criteria: { id, userId },
        });

        if (!news) {
            throw new ServiceError(
                'News with the provided id and user_id was not found, failed to archive',
            );
        }

        return news;
    }

    async deleteMany({ ids, userId }: { ids: number[]; userId: number }) {
        await Promise.all(ids.map((id) => this.repository.delete({ criteria: { id, userId } })));
    }
}
