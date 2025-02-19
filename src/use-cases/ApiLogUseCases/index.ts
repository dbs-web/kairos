// DB
import db from '@/infrastructure/database/DatabaseFactory';

// Repository
import ApiLogRepository from '@/repositories/ApiLogRepository';

//Service
import ApiLogService from '@/services/ApiLogService';

import CreateApiResponseUseCase from './CreateApiResponseUseCase';
import GetPaginatedLogsUseCase from './GetPaginatedLogsUseCase';

const apiLogRepository = new ApiLogRepository(db);
const apiLogService = new ApiLogService(apiLogRepository);

const getPaginatedLogsUseCase = new GetPaginatedLogsUseCase(apiLogService);
const createApiResponseUseCase = new CreateApiResponseUseCase(apiLogService);

export { getPaginatedLogsUseCase, createApiResponseUseCase };
