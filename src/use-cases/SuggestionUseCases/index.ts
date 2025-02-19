// DB
import db from '@/infrastructure/database/DatabaseFactory';

// Repository
import SuggestionRepository from '@/repositories/SuggestionRepository';

// Service
import SuggestionService from '@/services/SuggestionService';

// UseCases
import GetSuggestionsDataUseCase from './GetSuggestionsDataUseCase';
import UpdateSuggestionsStatusUseCase from './UpdateSuggestionStatusUseCase';
import CreateManySuggestionsUseCase from './CreateManySuggestionsUseCase';
import GetPaginatedSuggestionsUseCase from './GetPaginatedSuggestionsUseCase';

const suggestionRepository = new SuggestionRepository(db);
const suggestionService = new SuggestionService(suggestionRepository);

const getSuggestionsDataUseCase = new GetSuggestionsDataUseCase(suggestionService);
const updateSuggestionsStatusUseCase = new UpdateSuggestionsStatusUseCase(suggestionService);
const createManySuggestionsUseCase = new CreateManySuggestionsUseCase(suggestionService);
const getPaginatedSuggestionsUseCase = new GetPaginatedSuggestionsUseCase(suggestionService);

export {
    getSuggestionsDataUseCase,
    updateSuggestionsStatusUseCase,
    createManySuggestionsUseCase,
    getPaginatedSuggestionsUseCase,
};
