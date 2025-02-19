import { ISuggestionService } from '@/services/SuggestionService';
import { Status } from '@prisma/client';

export default class GetPaginatedSuggestionsUseCase {
    private suggestionService: ISuggestionService;

    constructor(suggestionService: ISuggestionService) {
        this.suggestionService = suggestionService;
    }

    async execute({
        userId,
        statuses,
        search,
        skip,
        limit,
    }: {
        userId: number;
        statuses: Status[];
        search: string;
        skip: number;
        limit: number;
    }) {
        return this.suggestionService.findWithQueryAndPagination({
            userId,
            statuses,
            query: search,
            skip,
            take: limit,
        });
    }
}
