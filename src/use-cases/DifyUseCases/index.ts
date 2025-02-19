import GenerateNewSuggestionUseCase from './GenerateNewSuggestionUseCase';
import SendContentCreationRequestsUseCase from './SendContentCreationRequestsUseCase';
import DifyAdapter from '@/adapters/DifyAdapter';

const difyAdapter = new DifyAdapter();
const sendContentCreationRequestsUseCase = new SendContentCreationRequestsUseCase(difyAdapter);

const generateNewSuggestionUseCase = new GenerateNewSuggestionUseCase(difyAdapter);

export { sendContentCreationRequestsUseCase, generateNewSuggestionUseCase };
