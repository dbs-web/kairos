import { IApiLog } from '@/domain/entities/api-log';
import IRepository, { CountPaginatedArgs, FindPaginatedArgs } from './Repository';
import IDatabaseClient, {
    DeleteArgs,
    FindUniqueArgs,
    UpdateArgs,
} from '@/infrastructure/database/IDatabaseClient';
import { RepositoryError } from '@/shared/errors';

export interface IApiLogRepository extends IRepository<IApiLog> {}

export default class ApiLogRepository implements IApiLogRepository {
    private db: IDatabaseClient;

    constructor(db: IDatabaseClient) {
        this.db = db;
    }

    async findUnique(args: FindUniqueArgs<IApiLog>): Promise<IApiLog> {
        return await this.db.findUnique<IApiLog>('apiLog', args);
    }

    async find({ criteria, skip, take, orderBy = { id: 'desc' } }: FindPaginatedArgs) {
        return await this.db.findMany<IApiLog>('apiLog', {
            criteria,
            skip,
            take,
            orderBy: orderBy,
        });
    }

    async count({ criteria }: CountPaginatedArgs) {
        return this.db.count('apiLog', {
            criteria,
        });
    }

    async create(args: Omit<IApiLog, 'id'>): Promise<IApiLog> {
        try {
            return await this.db.create<IApiLog>('apiLog', {
                data: args,
            });
        } catch (error) {
            throw new RepositoryError('Error on create method', error as Error);
        }
    }

    async update({ criteria, data }: UpdateArgs<IApiLog>): Promise<IApiLog | undefined> {
        return await this.db.update<IApiLog>('apiLog', {
            criteria,
            data,
        });
    }

    async delete({ criteria }: DeleteArgs<IApiLog>): Promise<IApiLog | undefined> {
        return this.db.delete<IApiLog>('apiLog', {
            criteria,
        });
    }
}
