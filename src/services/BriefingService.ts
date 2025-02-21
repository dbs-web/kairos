import { IBriefing } from '@/domain/entities/briefing';

import { IBriefingRepository } from '../repositories/BriefingRepository';
import { FindPaginatedServiceArgs, IPaginatedDataService } from './PaginatedDataService';
import { ServiceError } from '@/shared/errors';

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
    findById: (args: FindByIdArgs) => Promise<IBriefing>;
    create: (data: Omit<IBriefing, 'id'>) => Promise<IBriefing>;
    createMany: (dataArr: Omit<IBriefing, 'id'>[]) => Promise<IBriefing[]>;
    deleteMany: ({ ids, userId }: { ids: number[]; userId: number }) => Promise<void>;
    update: (args: UpdateBriefingArgs) => Promise<IBriefing>;
    delete: (args: DeleteBriefingArgs) => Promise<IBriefing>;
}

export default class BriefingService implements IBriefingService {
    private repository: IBriefingRepository;

    constructor(briefingRepository: IBriefingRepository) {
        this.repository = briefingRepository;
    }

    async findById({ id, userId }: FindByIdArgs): Promise<IBriefing> {
        const briefing = await this.repository.findUnique({
            criteria: {
                id,
                userId,
            },
        });

        if (!briefing) {
            throw new ServiceError('Briefing with the provided id was not found!');
        }

        return briefing;
    }

    async findByNewsId({ newsId, userId }: { newsId: number; userId: number }): Promise<IBriefing> {
        const briefing = await this.repository.findUnique({
            criteria: {
                userId,
                newsId,
            },
        });

        if (!briefing) {
            throw new ServiceError('Briefing with the provided newsID was not found!');
        }

        return briefing;
    }

    async findByRelatedSuggestionId({
        suggestionId,
        userId,
    }: FindByRelatedSuggestionIdArgs): Promise<IBriefing> {
        const briefing = await this.repository.find({
            criteria: {
                suggestionId,
                userId,
            },
        });

        if (!briefing?.length || briefing.length === 0) {
            throw new ServiceError('Briefing with the provided suggestionID was not found!');
        }

        return briefing[0];
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

    async create(data: Omit<IBriefing, 'id'>): Promise<IBriefing> {
        return this.repository.create(data);
    }

    async createMany(dataArr: Omit<IBriefing, 'id'>[]): Promise<IBriefing[]> {
        return this.repository.createMany(dataArr);
    }

    async update({ id, userId, data }: UpdateBriefingArgs): Promise<IBriefing> {
        const briefing = await this.repository.update({
            criteria: {
                id,
                userId,
            },
            data,
        });

        if (!briefing) {
            throw new ServiceError(
                'Briefing with the provided id and user_id was not found, failed to update.',
            );
        }

        return briefing;
    }

    async delete({ id, userId }: DeleteBriefingArgs): Promise<IBriefing> {
        const briefing = await this.repository.delete({ criteria: { id, userId } });

        if (!briefing) {
            throw new ServiceError(
                'Briefing with provided id and user_id was not found, failed to archive',
            );
        }

        return briefing;
    }

    async deleteMany({ ids, userId }: DeleteManyBriefingArgs) {
        await Promise.all(ids.map((id) => this.repository.delete({ criteria: { id, userId } })));
    }
}
