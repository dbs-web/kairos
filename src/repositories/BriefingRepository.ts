import { IBriefing } from '@/domain/entities/briefing';
import { INews } from '@/domain/entities/news';
import IRepository, { CountPaginatedArgs, FindPaginatedArgs } from './Repository';
import IDatabaseClient, {
    DeleteArgs,
    FindUniqueArgs,
    UpdateArgs,
} from '@/infrastructure/database/IDatabaseClient';
import { Status } from '@/domain/entities/status';

export interface CreateManyArgs {
    data: IBriefing[] | INews[];
    refType: 'news' | 'suggestion';
    status?: Status;
}

export interface IBriefingRepository extends IRepository<IBriefing> {
    createMany: (briefingArr: Omit<IBriefing, 'id'>[]) => Promise<IBriefing[]>;
}

export default class BriefingRepository implements IBriefingRepository {
    private db: IDatabaseClient;

    constructor(db: IDatabaseClient) {
        this.db = db;
    }

    async findUnique(args: FindUniqueArgs<IBriefing>): Promise<IBriefing> {
        return await this.db.findUnique<IBriefing>('briefing', args);
    }
    async find({ criteria, skip, take, orderBy = { id: 'desc' } }: FindPaginatedArgs) {
        return await this.db.findMany<IBriefing>('briefing', {
            criteria,
            skip,
            take,
            orderBy: orderBy,
        });
    }

    async count({ criteria }: CountPaginatedArgs) {
        return this.db.count('briefing', {
            criteria,
        });
    }

    async create({
        title,
        date,
        newsId,
        suggestionId,
        userId,
        sources,
    }: Partial<IBriefing>): Promise<IBriefing> {
        if (!newsId && !suggestionId) {
            throw new Error('You must provide either a newsId or a suggestionId.');
        }

        const dataToCreate: any = {
            title,
            date,
            userId,
            status: Status.EM_PRODUCAO,
            user: {
                connect: {
                    id: userId,
                },
            },
            sources: sources ?? undefined,
        };

        if (newsId) {
            dataToCreate.news = { connect: { id: newsId } };
        } else if (suggestionId) {
            dataToCreate.suggestion = { connect: { id: suggestionId } };
        }

        const briefing = await this.db.create<IBriefing>('briefing', {
            data: dataToCreate,
        });

        return briefing;
    }

    async createMany(dataArr: Omit<IBriefing, 'id'>[]): Promise<IBriefing[]> {
        return this.db.createMany<IBriefing>('briefing', dataArr);
    }

    async update({ criteria, data }: UpdateArgs<IBriefing>): Promise<IBriefing | undefined> {
        const jsonSource = data.sources ?? undefined;

        return await this.db.update<IBriefing>('briefing', {
            criteria,
            data: {
                ...data,
                sources: jsonSource,
            },
        });
    }

    async delete({ criteria }: DeleteArgs<IBriefing>): Promise<IBriefing | undefined> {
        return this.db.update<IBriefing>('briefing', {
            criteria,
            data: {
                status: Status.ARQUIVADO,
            },
        });
    }
}
