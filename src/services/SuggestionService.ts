import { ISuggestionRepository } from '../repositories/SuggestionRepository';
import { ISuggestion } from '@/domain/entities/suggestion';
import { FindPaginatedServiceArgs, IPaginatedDataService } from './PaginatedDataService';
import { UpdateManyArgs } from '@/infrastructure/database/IDatabaseClient';
import { ServiceError } from '@/shared/errors';

interface UpdateSuggestionArgs {
    id: number;
    userId: number;
    data: Partial<ISuggestion>;
}

interface DeleteSuggestionArgs {
    id: number;
    userId: number;
}

interface DeleteManySuggestionArgs {
    ids: number[];
    userId: number;
}

interface FindManySuggestionsByIds {
    ids: number[];
    userId: number;
}

export interface ISuggestionService extends IPaginatedDataService<ISuggestion> {
    create(data: Omit<ISuggestion, 'id'>): Promise<ISuggestion>;
    createMany(dataArr: Omit<ISuggestion, 'id'>[]): Promise<ISuggestion[]>;
    createManyWithDuplicateCheck: (suggestionsDataArr: Omit<ISuggestion, 'id'>[], userId: number) => Promise<ISuggestion[]>;
    update(args: UpdateSuggestionArgs): Promise<ISuggestion>;
    delete(args: DeleteSuggestionArgs): Promise<ISuggestion>;
    findUnique(args: { id: number; userId: number }): Promise<ISuggestion>;
    deleteMany: (args: DeleteManySuggestionArgs) => Promise<void>;
}

export default class SuggestionService implements ISuggestionService {
    private repository: ISuggestionRepository;

    constructor(suggestionRepository: ISuggestionRepository) {
        this.repository = suggestionRepository;
    }

    async findUnique({ id, userId }: { id: number; userId: number }): Promise<ISuggestion> {
        const suggestion = await this.repository.findUnique({
            criteria: {
                id,
                userId,
            },
        });

        if (!suggestion) {
            throw new ServiceError('Suggestion with the provided id and user_id was not found');
        }

        return suggestion;
    }

    async findManyByIds({ ids, userId }: FindManySuggestionsByIds): Promise<ISuggestion[]> {
        return this.repository.findManyBiIds({ ids, userId });
    }

    async findWithQueryAndPagination({
        userId,
        statuses,
        query,
        skip,
        take,
        orderBy,
    }: FindPaginatedServiceArgs): Promise<[ISuggestion[], number]> {
        const criteria = {
            userId,
            status: {
                in: statuses,
            },
            post_text: {
                contains: query,
            },
        };

        return Promise.all([
            this.repository.find({ criteria, skip, take, orderBy }),
            this.repository.count({ criteria }),
        ]);
    }

    async create(data: Omit<ISuggestion, 'id'>): Promise<ISuggestion> {
        return this.repository.create(data);
    }

    async createMany(suggestionsDataArr: Omit<ISuggestion, 'id'>[]): Promise<ISuggestion[]> {
        return this.repository.createMany(suggestionsDataArr);
    }

    async createManyWithDuplicateCheck(suggestionsDataArr: Omit<ISuggestion, 'id'>[], userId: number): Promise<ISuggestion[]> {
        try {
            console.log('SuggestionService.createManyWithDuplicateCheck - Starting with', suggestionsDataArr.length, 'items');

            // Import here to avoid circular dependency
            const { generateSuggestionContentHash, filterDuplicateSuggestions } = await import('@/utils/duplicateDetection');
            console.log('SuggestionService.createManyWithDuplicateCheck - Imported duplicate detection utils');

            // Generate hashes for all new suggestion items
            const newContentHashes = suggestionsDataArr.map(suggestion => generateSuggestionContentHash(suggestion));
            console.log('SuggestionService.createManyWithDuplicateCheck - Generated', newContentHashes.length, 'hashes');

            // Check which hashes already exist in the database
            const existingHashes = await this.repository.findExistingContentHashes(userId, newContentHashes);
            console.log('SuggestionService.createManyWithDuplicateCheck - Found', existingHashes.size, 'existing hashes');

            // Filter out duplicates
            const filteredSuggestions = filterDuplicateSuggestions(suggestionsDataArr, existingHashes);
            console.log('SuggestionService.createManyWithDuplicateCheck - Filtered to', filteredSuggestions.length, 'unique items');

            // Create only the non-duplicate suggestions
            if (filteredSuggestions.length === 0) {
                console.log('SuggestionService.createManyWithDuplicateCheck - No items to create');
                return [];
            }

            const result = await this.repository.createMany(filteredSuggestions);
            console.log('SuggestionService.createManyWithDuplicateCheck - Created', result.length, 'items');
            return result;
        } catch (error) {
            console.error('Error in createManyWithDuplicateCheck:', error);
            // Fallback to regular creation without duplicate checking
            console.log('Falling back to regular createMany without duplicate checking');
            return this.repository.createMany(suggestionsDataArr);
        }
    }

    async update({ id, userId, data }: UpdateSuggestionArgs): Promise<ISuggestion> {
        const suggestion = await this.repository.update({
            criteria: {
                id,
                userId,
            },
            data,
        });

        if (!suggestion) {
            throw new ServiceError(
                'Suggestion with the provided id and user_id was not found, failed to update',
            );
        }

        return suggestion;
    }

    async updateMany(args: UpdateManyArgs<ISuggestion>): Promise<ISuggestion[]> {
        return await this.repository.updateMany(args);
    }
    async delete({ id, userId }: DeleteSuggestionArgs): Promise<ISuggestion> {
        const suggestion = await this.repository.delete({
            criteria: {
                id,
                userId,
            },
        });

        if (!suggestion) {
            throw new ServiceError(
                'Suggestion with the provided id and user_id was not found, failed to archive',
            );
        }

        return suggestion;
    }

    async deleteMany({ ids, userId }: DeleteManySuggestionArgs) {
        await Promise.all(
            ids.map((id) =>
                this.repository.delete({
                    criteria: {
                        id,
                        userId,
                    },
                }),
            ),
        );
    }
}
