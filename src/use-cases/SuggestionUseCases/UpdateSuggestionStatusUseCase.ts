import { Status } from '@/domain/entities/status';
import { ISuggestion } from '@/domain/entities/suggestion';
import ISuggestionService from '@/services/SuggestionService';

export default class UpdateSuggestionsStatusUseCase {
    private suggestionService: ISuggestionService;

    constructor(suggestionService: ISuggestionService) {
        this.suggestionService = suggestionService;
    }

    async execute({
        suggestions,
        userId,
        status,
    }: {
        suggestions: number[];
        userId: number;
        status: Status;
    }): Promise<ISuggestion[]> {
        const suggestionsToUpdate = suggestions.map((id) => ({
            id,
            userId,
            status,
        }));

        return await this.suggestionService.updateMany({ records: suggestionsToUpdate });
    }
}
