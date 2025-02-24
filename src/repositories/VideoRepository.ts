import IRepository, { CountPaginatedArgs, FindPaginatedArgs } from './Repository';

import IDatabaseClient, {
    DeleteArgs,
    FindUniqueArgs,
    UpdateArgs,
} from '@/infrastructure/database/IDatabaseClient';
import { IVideo } from '@/domain/entities/video';
import { RepositoryError } from '@/shared/errors';

export interface IVideoRepository extends IRepository<IVideo> {}

export default class VideoRepository implements IVideoRepository {
    private db: IDatabaseClient;

    constructor(db: IDatabaseClient) {
        this.db = db;
    }

    async findUnique(args: FindUniqueArgs<IVideo>): Promise<IVideo | undefined> {
        try {
            return await this.db.findUnique<IVideo>('video', args);
        } catch (error) {
            throw new RepositoryError('Error finding unique video', error as Error);
        }
    }

    async find({ criteria, skip, take, orderBy = { id: 'desc' } }: FindPaginatedArgs) {
        try {
            return await this.db.findMany<IVideo>('video', {
                criteria,
                skip,
                take,
                orderBy: orderBy,
            });
        } catch (error) {
            throw new RepositoryError('Error finding videos', error as Error);
        }
    }

    async count({ criteria }: CountPaginatedArgs) {
        try {
            return this.db.count('video', {
                criteria,
            });
        } catch (error) {
            throw new RepositoryError('Error counting videos', error as Error);
        }
    }

    async create(videoData: Omit<IVideo, 'id'>): Promise<IVideo> {
        try {
            return await this.db.create<IVideo>('video', {
                data: videoData,
            });
        } catch (error) {
            throw new RepositoryError('Error creating video', error as Error);
        }
    }

    async update({ criteria, data }: UpdateArgs<IVideo>): Promise<IVideo | undefined> {
        try {
            data.legenda = '';
            return await this.db.update<IVideo>('video', {
                criteria,
                data,
            });
        } catch (error) {
            throw new RepositoryError('Error updating video', error as Error);
        }
    }

    async delete(args: DeleteArgs<IVideo>): Promise<IVideo | undefined> {
        try {
            return await this.db.delete<IVideo>('video', args);
        } catch (error) {
            throw new RepositoryError('Error deleting video', error as Error);
        }
    }
}
