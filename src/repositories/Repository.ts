import { DeleteArgs, FindUniqueArgs, UpdateArgs } from '@/infrastructure/database/IDatabaseClient';

export interface FindPaginatedArgs {
    criteria: any;
    skip?: number;
    take?: number;
    orderBy?: object;
}

export interface CountPaginatedArgs {
    criteria: any;
}

export default interface IRepository<T> {
    findUnique(args: FindUniqueArgs<T>): Promise<T>;
    find({ criteria, skip, take, orderBy }: FindPaginatedArgs): Promise<T[]>;
    count(args: CountPaginatedArgs): Promise<number>;
    create(data: Omit<T, 'id'>): Promise<T>;
    update({ criteria, data }: UpdateArgs<T>): Promise<T | undefined>;
    delete({ criteria }: DeleteArgs<T>): Promise<T | undefined>;
}
