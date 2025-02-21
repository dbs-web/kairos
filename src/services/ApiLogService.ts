import { IApiLog } from '@/domain/entities/api-log';

import { FindPaginatedServiceArgs, IPaginatedDataService } from './PaginatedDataService';
import { IApiLogRepository } from '@/repositories/ApiLogRepository';
import { ServiceError } from '@/shared/errors';

export interface IApiLogService extends IPaginatedDataService<IApiLog> {
    create: (data: Omit<IApiLog, 'id'>) => Promise<IApiLog>;
}

export default class ApiLogService implements IApiLogService {
    private repository: IApiLogRepository;

    constructor(apiLogRepository: IApiLogRepository) {
        this.repository = apiLogRepository;
    }

    async findById({ id }: { id: number }): Promise<IApiLog> {
        const apiLog = await this.repository.findUnique({
            criteria: {
                id,
            },
        });

        if (!apiLog) {
            throw new ServiceError('Log with this id was not found');
        }

        return apiLog;
    }

    async findWithQueryAndPagination({
        query,
        skip,
        take,
        orderBy,
    }: FindPaginatedServiceArgs): Promise<[IApiLog[], number]> {
        return Promise.all([
            this.repository.find({ criteria: {}, skip, take, orderBy }),
            this.repository.count({ criteria: {} }),
        ]);
    }

    async create(data: Omit<IApiLog, 'id'>): Promise<IApiLog> {
        try {
            return this.repository.create(data);
        } catch (error) {
            throw new ServiceError('Error on APILog Service', error as Error);
        }
    }
}
