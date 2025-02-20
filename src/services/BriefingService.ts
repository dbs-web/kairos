import { IBriefing } from '@/domain/entities/briefing';

import { IBriefingRepository } from '../repositories/BriefingRepository';
import { FindPaginatedServiceArgs, IPaginatedDataService } from './PaginatedDataService';

interface FindByIdArgs {
    id: number;
    userId?: number;
}

interface UpdateBriefingArgs {
    id: number;
    userId?: number;
    data: Partial<IBriefing>;
}

interface UpdateManyBriefingArgs {
    dataArr: Partial<IBriefing> & { id: number }[];
    userId: number;
}

interface DeleteBriefingArgs {
    id: number;
    userId: number;
}

interface DeleteManyBriefingArgs {
    ids: number[];
    userId: number;
}

interface FindByRelatedSuggestionIdArgs {
    suggestionId: number;
    userId: number;
}

export interface IBriefingService extends IPaginatedDataService<IBriefing> {
    findById: (args: FindByIdArgs) => Promise<IBriefing | undefined>;
    create: (data: Omit<IBriefing, 'id'>) => Promise<IBriefing | undefined>;
    createMany: (dataArr: Omit<IBriefing, 'id'>[]) => Promise<IBriefing[]>;
    deleteMany: ({ ids, userId }: { ids: number[]; userId: number }) => Promise<void>;
    update: (args: UpdateBriefingArgs) => Promise<IBriefing | undefined>;
    delete: (args: DeleteBriefingArgs) => Promise<IBriefing | undefined>;
}

export default class BriefingService implements IBriefingService {
    private repository: IBriefingRepository;

    constructor(briefingRepository: IBriefingRepository) {
        this.repository = briefingRepository;
    }

    async findById({ id, userId }: FindByIdArgs): Promise<IBriefing> {
        return await this.repository.findUnique({
            criteria: {
                id,
                userId,
            },
        });
    }

    async findByNewsId({
        newsId,
        userId,
    }: {
        newsId: number;
        userId: number;
    }): Promise<IBriefing | undefined> {
        return await this.repository.findUnique({
            criteria: {
                userId,
                newsId,
            },
        });
    }

    async findByRelatedSuggestionId({ suggestionId, userId }: FindByRelatedSuggestionIdArgs) {
        return await this.repository.find({
            criteria: {
                suggestionId,
                userId,
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
    }: FindPaginatedServiceArgs): Promise<[IBriefing[], number]> {
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

    async create(data: Omit<IBriefing, 'id'>): Promise<IBriefing | undefined> {
        return this.repository.create(data);
    }

    async createMany(dataArr: Omit<IBriefing, 'id'>[]): Promise<IBriefing[]> {
        return this.repository.createMany(dataArr);
    }

    async update({ id, userId, data }: UpdateBriefingArgs): Promise<IBriefing | undefined> {
        return this.repository.update({
            criteria: {
                id,
                userId,
            },
            data,
        });
    }

    async delete({ id, userId }: DeleteBriefingArgs): Promise<IBriefing | undefined> {
        return this.repository.delete({ criteria: { id, userId } });
    }

    async deleteMany({ ids, userId }: DeleteManyBriefingArgs) {
        await Promise.all(ids.map((id) => this.repository.delete({ criteria: { id, userId } })));
    }
}
