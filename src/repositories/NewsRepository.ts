import IRepository, { CountPaginatedArgs, FindPaginatedArgs } from './Repository';
import IDatabaseClient, {
    DeleteArgs,
    FindUniqueArgs,
    UpdateArgs,
} from '@/infrastructure/database/IDatabaseClient';

import { INews } from '@/domain/entities/news';
import { Status } from '@/domain/entities/status';

export interface INewsRepository extends IRepository<INews> {
    createMany: (newssDataArr: Omit<INews, 'id'>[]) => Promise<INews[]>;
}

export default class NewsRepository implements INewsRepository {
    private db: IDatabaseClient;

    constructor(db: IDatabaseClient) {
        this.db = db;
    }

    async findUnique(args: FindUniqueArgs<INews>): Promise<INews> {
        return await this.db.findUnique<INews>('news', args);
    }

    async find({ criteria, skip, take, orderBy = { id: 'desc' } }: FindPaginatedArgs) {
        return await this.db.findMany<INews>('news', {
            criteria,
            skip,
            take,
            orderBy: orderBy,
        });
    }

    async count({ criteria }: CountPaginatedArgs) {
        return this.db.count('news', { criteria });
    }

    async create(data: Omit<INews, 'id'>): Promise<INews> {
        const news = await this.db.create<INews>('news', {
            data: data,
        });

        return news;
    }

    async createMany(newsArr: Omit<INews, 'id'>[]): Promise<INews[]> {
        return this.db.createMany<INews>('news', newsArr);
    }

    async update(args: UpdateArgs<INews>): Promise<INews | undefined> {
        return await this.db.update<INews>('news', args);
    }

    async delete(args: DeleteArgs<INews>): Promise<INews | undefined> {
        return this.db.update<INews>('news', {
            criteria: args.criteria,
            data: {
                status: Status.ARQUIVADO,
            },
        });
    }
}
