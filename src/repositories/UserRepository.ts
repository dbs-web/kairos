import { IUser } from '@/domain/entities/user';
import IRepository, { CountPaginatedArgs, FindPaginatedArgs } from './Repository';
import IDatabaseClient, {
    DeleteArgs,
    FindUniqueArgs,
    UpdateArgs,
} from '@/infrastructure/database/IDatabaseClient';

export interface IUserRepository extends IRepository<IUser> {}

export default class UserRepository implements IUserRepository {
    private db: IDatabaseClient;

    constructor(db: IDatabaseClient) {
        this.db = db;
    }

    async findUnique(args: FindUniqueArgs<IUser>): Promise<IUser> {
        return await this.db.findUnique<IUser>('user', args);
    }

    async find({ criteria = { role: 'USER' }, skip, take, orderBy }: FindPaginatedArgs) {
        return await this.db.findMany<IUser>('news', {
            criteria,
            skip,
            take,
            orderBy: orderBy,
        });
    }

    async count({ criteria }: CountPaginatedArgs) {
        return this.db.count('user', { criteria });
    }

    async create(data: Omit<IUser, 'id'>): Promise<IUser> {
        const news = await this.db.create<IUser>('news', {
            data: data,
        });

        return news;
    }

    async update(args: UpdateArgs<IUser>): Promise<IUser | undefined> {
        return await this.db.update<IUser>('news', args);
    }

    async delete(args: DeleteArgs<IUser>): Promise<IUser | undefined> {
        return this.db.delete('user', args);
    }
}
