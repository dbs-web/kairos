import { Status } from '@prisma/client';

export interface FindPaginatedServiceArgs {
    userId?: number;
    statuses?: Status[];
    query?: string;
    skip?: number;
    take?: number;
    orderBy?: object;
}

export interface IPaginatedDataService<T> {
    findWithQueryAndPagination: (args: FindPaginatedServiceArgs) => Promise<[T[], number]>;
}
