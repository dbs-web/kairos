import CheckContentUseCase from './CheckContentUseCase';
import CreateSubtitlesUseCase from './CreateVideoSubtitlesUseCase';
import CustomBriefingRequestUseCase from './CustomBriefingRequestUseCase';
import GenerateNewSuggestionUseCase from './GenerateNewSuggestionUseCase';
import SendContentCreationRequestsUseCase from './SendContentCreationRequestsUseCase';
import DifyAdapter from '@/adapters/DifyAdapter';

const difyAdapter = new DifyAdapter();

const createSubtitlesUseCase = new CreateSubtitlesUseCase(difyAdapter);
const sendContentCreationRequestsUseCase = new SendContentCreationRequestsUseCase(difyAdapter);
const generateNewSuggestionUseCase = new GenerateNewSuggestionUseCase(difyAdapter);
const customBriefingRequestUseCase = new CustomBriefingRequestUseCase(difyAdapter);
const checkContentUseCase = new CheckContentUseCase(difyAdapter);

export {
    sendContentCreationRequestsUseCase,
    generateNewSuggestionUseCase,
    customBriefingRequestUseCase,
    createSubtitlesUseCase,
    checkContentUseCase,
};
