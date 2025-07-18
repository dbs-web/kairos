import { ISuggestion } from '@/domain/entities/suggestion';
import { ISuggestionService } from '@/services/SuggestionService';

export default class CreateManySuggestionsUseCase {
    private suggestionService: ISuggestionService;

    constructor(suggestionService: ISuggestionService) {
        this.suggestionService = suggestionService;
    }

    async execute({ suggestionsArr, userId }: { suggestionsArr: Omit<ISuggestion, 'id'>[]; userId: number }) {
        console.log('CreateManySuggestionsUseCase - Received data:', JSON.stringify(suggestionsArr, null, 2));
        return this.suggestionService.createManyWithDuplicateCheck(suggestionsArr, userId);
    }
}
