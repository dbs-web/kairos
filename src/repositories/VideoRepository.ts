import IRepository, { CountPaginatedArgs, FindPaginatedArgs } from './Repository';

import IDatabaseClient, {
    DeleteArgs,
    FindUniqueArgs,
    UpdateArgs,
} from '@/infrastructure/database/IDatabaseClient';
import { IVideo } from '@/domain/entities/video';

export interface IVideoRepository extends IRepository<IVideo> {}

export default class VideoRepository implements IVideoRepository {
    private db: IDatabaseClient;

    constructor(db: IDatabaseClient) {
        this.db = db;
    }

    async findUnique(args: FindUniqueArgs<IVideo>): Promise<IVideo> {
        return await this.db.findUnique<IVideo>('video', args);
    }

    async find({ criteria, skip, take, orderBy = { id: 'desc' } }: FindPaginatedArgs) {
        return await this.db.findMany<IVideo>('video', {
            criteria,
            skip,
            take,
            orderBy: orderBy,
        });
    }

    async count({ criteria }: CountPaginatedArgs) {
        return this.db.count('video', {
            criteria,
        });
    }

    async create(suggestionData: Omit<IVideo, 'id'>): Promise<IVideo> {
        console.log(suggestionData);
        
        const suggestion = await this.db.create<IVideo>('video', {
            data: suggestionData,
        });

        return suggestion;
    }

    async update(args: UpdateArgs<IVideo>): Promise<IVideo | undefined> {
        return await this.db.update<IVideo>('video', args);
    }

    async delete(args: DeleteArgs<IVideo>): Promise<IVideo | undefined> {
        return this.db.delete<IVideo>('video', args);
    }
}
