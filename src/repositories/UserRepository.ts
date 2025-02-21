import { IUser } from '@/domain/entities/user';
import IRepository, { CountPaginatedArgs, FindPaginatedArgs } from './Repository';
import IDatabaseClient, {
    DeleteArgs,
    FindUniqueArgs,
    UpdateArgs,
} from '@/infrastructure/database/IDatabaseClient';
import { RepositoryError } from '@/shared/errors';

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
        try {
            return await this.db.findMany<IUser>('user', {
                criteria,
                skip,
                take,
                orderBy: orderBy,
            });
        } catch (e) {
            throw new RepositoryError(`Error on find user: ${e instanceof Error ? e.message : e}`);
        }
    }

    async count({ criteria }: CountPaginatedArgs) {
        return this.db.count('user', { criteria });
    }

    async create(data: Omit<IUser, 'id'>): Promise<IUser> {
        const user = await this.db.create<IUser>('user', {
            data: data,
        });

        return user;
    }

    async update(args: UpdateArgs<IUser>): Promise<IUser | undefined> {
        return await this.db.update<IUser>('user', args);
    }

    async delete(args: DeleteArgs<IUser>): Promise<IUser | undefined> {
        return this.db.delete('user', args);
    }
}
