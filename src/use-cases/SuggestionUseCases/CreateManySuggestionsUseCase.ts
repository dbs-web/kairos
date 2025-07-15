import { ISuggestion } from '@/domain/entities/suggestion';
import { ISuggestionService } from '@/services/SuggestionService';

export default class CreateManySuggestionsUseCase {
    private suggestionService: ISuggestionService;

    constructor(suggestionService: ISuggestionService) {
        this.suggestionService = suggestionService;
    }

    async execute({ suggestionsArr }: { suggestionsArr: Omit<ISuggestion, 'id'>[] }) {
        console.log('CreateManySuggestionsUseCase - Received data:', JSON.stringify(suggestionsArr, null, 2));
        await this.suggestionService.createMany(suggestionsArr);
    }
}
