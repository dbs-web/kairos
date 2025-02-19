// DB
import db from '@/infrastructure/database/DatabaseFactory';

// Repository
import BriefingRepository from '@/repositories/BriefingRepository';

// Service
import BriefingService from '@/services/BriefingService';

import CreateBriefingsUseCase from './CreateBriefingsUseCase';
import GetPaginatedBriefingsUseCase from './GetPaginatedBriefingsUseCase';
import UpdateBriefingUseCase from './UpdateBriefingUseCase';
import DeleteBriefingUseCase from './DeleteBriefingUseCase';
import GetBriefingsUseCase from './GetBriefingsUseCase';

const briefingRepository = new BriefingRepository(db);
const briefingService = new BriefingService(briefingRepository);

const getBriefingsUseCase = new GetBriefingsUseCase(briefingService);
const getPaginatedBriefingsUseCase = new GetPaginatedBriefingsUseCase(briefingService);
const createBriefingsUseCase = new CreateBriefingsUseCase(briefingService);
const updateBriefingUseCase = new UpdateBriefingUseCase(briefingService);
const deleteBriefingUseCase = new DeleteBriefingUseCase(briefingService);

export {
    getBriefingsUseCase,
    getPaginatedBriefingsUseCase,
    createBriefingsUseCase,
    updateBriefingUseCase,
    deleteBriefingUseCase,
};
