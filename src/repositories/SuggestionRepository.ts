import { ISuggestion } from '@/domain/entities/suggestion';
import { Status } from '@/domain/entities/status';
import IRepository, { CountPaginatedArgs, FindPaginatedArgs } from './Repository';

import IDatabaseClient, {
    DeleteArgs,
    FindUniqueArgs,
    UpdateArgs,
    UpdateManyArgs,
} from '@/infrastructure/database/IDatabaseClient';

interface FindManySuggestionsByIdArgs {
    ids: number[];
    userId: number;
}

export interface ISuggestionRepository extends IRepository<ISuggestion> {
    updateMany: (args: UpdateManyArgs<ISuggestion>) => Promise<ISuggestion[]>;
    createMany: (suggestionsDataArr: Omit<ISuggestion, 'id'>[]) => Promise<ISuggestion[]>;
    findManyBiIds: ({ ids, userId }: FindManySuggestionsByIdArgs) => Promise<ISuggestion[]>;
}

export default class SuggestionRepository implements ISuggestionRepository {
    private db: IDatabaseClient;

    constructor(db: IDatabaseClient) {
        this.db = db;
    }

    async findUnique(args: FindUniqueArgs<ISuggestion>): Promise<ISuggestion> {
        return await this.db.findUnique<ISuggestion>('suggestion', args);
    }

    async findManyBiIds({ ids, userId }: FindManySuggestionsByIdArgs): Promise<ISuggestion[]> {
        return await this.db.findMany<ISuggestion>('suggestion', {
            where: {
                id: {
                    in: ids,
                },
                userId,
            },
        });
    }

    async find({ criteria, skip, take, orderBy = { id: 'desc' } }: FindPaginatedArgs) {
        return await this.db.findMany<ISuggestion>('suggestion', {
            criteria,
            skip,
            take,
            orderBy: orderBy,
        });
    }

    async count({ criteria }: CountPaginatedArgs) {
        return this.db.count('suggestion', { criteria });
    }

    async create(suggestionData: Omit<ISuggestion, 'id'>): Promise<ISuggestion> {
        const suggestion = await this.db.create<ISuggestion>('suggestion', {
            data: suggestionData,
        });

        return suggestion;
    }

    async createMany(suggestionsDataArr: Omit<ISuggestion, 'id'>[]): Promise<ISuggestion[]> {
        return await this.db.createMany<ISuggestion>('suggestion', suggestionsDataArr);
    }

    async update(args: UpdateArgs<ISuggestion>): Promise<ISuggestion | undefined> {
        return await this.db.update<ISuggestion>('suggestion', args);
    }

    async updateMany(args: UpdateManyArgs<ISuggestion>): Promise<ISuggestion[]> {
        return await this.db.updateMany<ISuggestion>('suggestion', args);
    }

    async delete({ criteria }: DeleteArgs<ISuggestion>): Promise<ISuggestion | undefined> {
        return this.db.update('suggestion', {
            criteria,
            data: {
                status: Status.ARQUIVADO,
            },
        });
    }
}
