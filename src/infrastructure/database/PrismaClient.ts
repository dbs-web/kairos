import { PrismaClient } from '@prisma/client';
import IDatabaseClient, {
    FindUniqueArgs,
    UpdateArgs,
    DeleteArgs,
    FindByFieldArgs,
    UpdateManyArgs,
    DeleteManyArgs,
} from './IDatabaseClient';

import { Suggestion as PrismaSuggestion } from '@prisma/client';
import { News as PrismaNews } from '@prisma/client';
import { Briefing as PrismaBriefing } from '@prisma/client';

import { ISuggestion } from '@/domain/entities/suggestion';
import { INews } from '@/domain/entities/news';
import { IBriefing } from '@/domain/entities/briefing';
import { mapBriefing } from '../mappers/mapBriefing';
import { mapSuggestion } from '../mappers/mapSuggestion';
import { mapNews } from '../mappers/mapNews';
import { DatabaseError } from '@/shared/errors';

export default class PrismaDatabaseClient implements IDatabaseClient {
    private prisma: PrismaClient;

    private mappers: { [model: string]: (data: any) => any } = {
        suggestion: (data: PrismaSuggestion): ISuggestion => mapSuggestion(data),
        news: (data: PrismaNews): INews => mapNews(data),
        briefing: (data: PrismaBriefing): IBriefing => mapBriefing(data),
    };

    constructor() {
        this.prisma = new PrismaClient();
    }

    async connect(): Promise<void> {
        // pass
    }

    async disconnect(): Promise<void> {
        // pass
    }

    private applyMapper<T>(model: string, data: any): T {
        const mapper = this.mappers[model];
        return mapper ? mapper(data) : data;
    }

    private async executeQuery<T>(model: string, query: Promise<any>): Promise<T> {
        const result = await query;
        if (this.mappers[model]) {
            if (Array.isArray(result)) {
                return result.map((item: any) => this.applyMapper(model, item)) as unknown as T;
            } else {
                return this.applyMapper(model, result) as T;
            }
        }
        return result as T;
    }

    async findUnique<T>(model: string, { criteria }: FindUniqueArgs<T>): Promise<T> {
        return this.executeQuery<T>(
            model,
            (this.prisma as any)[model].findUnique({ where: criteria }),
        );
    }

    async findMany<T>(model: string, { criteria, skip, take, orderBy }: any): Promise<T[]> {
        return this.executeQuery<T[]>(
            model,
            (this.prisma as any)[model].findMany({ where: criteria, skip, take, orderBy }),
        );
    }

    async findByField<T, K extends keyof T>(
        model: string,
        { field, value, values }: FindByFieldArgs<T, K>,
    ): Promise<T[]> {
        try {
            let whereClause;
            if (values !== undefined) {
                whereClause = { [field]: { in: values } };
            } else if (value !== undefined) {
                whereClause = { [field]: value };
            } else {
                throw new DatabaseError("Informe 'value' ou 'values' para realizar a busca.");
            }
            return this.executeQuery<T[]>(
                model,
                (this.prisma as any)[model].findMany({ where: whereClause }),
            );
        } catch (error) {
            throw new DatabaseError('Error on findByField method.', error as Error);
        }
    }

    async count(model: string, { criteria }: any): Promise<number> {
        try {
            return (this.prisma as any)[model].count({
                where: criteria,
            });
        } catch (error) {
            throw new DatabaseError('Error on database count method.', error as Error);
        }
    }

    async create<T>(model: string, args: any): Promise<T> {
        try {
            return this.executeQuery<T>(model, (this.prisma as any)[model].create(args));
        } catch (error) {
            throw new DatabaseError('Error on database create method.', error as Error);
        }
    }

    async createMany<T>(model: string, records: Omit<T, 'id'>[]): Promise<T[]> {
        try {
            const operations = records.map((record) =>
                (this.prisma as any)[model].create({ data: record }),
            );
            const result = await this.prisma.$transaction(operations);
            return this.mappers[model]
                ? result.map((item: any) => this.applyMapper<T>(model, item))
                : result;
        } catch (error) {
            throw new DatabaseError('Error on database createMany method', error as Error);
        }
    }

    async update<T>(model: string, { criteria, data }: UpdateArgs<T>): Promise<T> {
        try {
            return this.executeQuery<T>(
                model,
                (this.prisma as any)[model].update({
                    where: criteria,
                    data,
                }),
            );
        } catch (error) {
            throw new DatabaseError('Error on database update method', error as Error);
        }
    }

    async updateMany<T>(model: string, args: UpdateManyArgs<T>): Promise<T[]> {
        try {
            const operations = args.records.map((record) =>
                (this.prisma as any)[model].update({
                    where: { id: record.id },
                    data: record,
                }),
            );
            const result = await this.prisma.$transaction(operations);
            return this.mappers[model]
                ? result.map((item: any) => this.applyMapper<T>(model, item))
                : result;
        } catch (error) {
            throw new DatabaseError('Error on database updateMany method', error as Error);
        }
    }

    async delete<T>(model: string, { criteria }: DeleteArgs<T>): Promise<T> {
        try {
            return this.executeQuery<T>(
                model,
                (this.prisma as any)[model].delete({
                    where: criteria,
                }),
            );
        } catch (error) {
            throw new DatabaseError('Error on database delete method', error as Error);
        }
    }

    async deleteMany<T>(model: string, args: DeleteManyArgs): Promise<T> {
        try {
            return (this.prisma as any)[model].deleteMany({
                where: { id: { in: args.ids } },
            });
        } catch (error) {
            throw new DatabaseError('Error on database deleteMany method', error as Error);
        }
    }
}
