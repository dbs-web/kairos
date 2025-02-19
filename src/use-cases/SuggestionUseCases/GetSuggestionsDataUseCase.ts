import { ISuggestion } from '@/domain/entities/suggestion';
import ISuggestionService from '@/services/SuggestionService';

export default class GetSuggestionsDataUseCase {
    private suggestionService: ISuggestionService;

    constructor(suggestionService: ISuggestionService) {
        this.suggestionService = suggestionService;
    }

    async execute({
        suggestions,
        userId,
    }: {
        suggestions: number[];
        userId: number;
    }): Promise<ISuggestion[]> {
        return this.suggestionService.findManyByIds({
            ids: suggestions,
            userId,
        });
    }
}
