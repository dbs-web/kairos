// DB
import db from '@/infrastructure/database/DatabaseFactory';

// Repository
import VideoRepository from '@/repositories/VideoRepository';

// Service
import VideoService from '@/services/VideoService';

// Use Cases
import AddVideoSubtitleUseCase from './AddVideoSubtitleUseCase';
import AddVideoUrlUseCase from './AddVideoUrllUseCase';
import AddVideoFailedStatusUseCase from './AddVideoFailedStatusUseCase';
import CreateVideoUseCase from './CreateVideoUseCase';
import GetPaginatedVideosUseCase from './GetPaginatedVideosUseCase';

const videoRepository = new VideoRepository(db);
const videoService = new VideoService(videoRepository);

const createVideoUseCase = new CreateVideoUseCase(videoService);
const getPaginatedVideosUseCase = new GetPaginatedVideosUseCase(videoService);
const addVideoSubtitleUseCase = new AddVideoSubtitleUseCase(videoService);
const addVideoUrlUseCase = new AddVideoUrlUseCase(videoService);
const addVideoFailedStatusUseCase = new AddVideoFailedStatusUseCase(videoService);

export {
    createVideoUseCase,
    getPaginatedVideosUseCase,
    addVideoSubtitleUseCase,
    addVideoUrlUseCase,
    addVideoFailedStatusUseCase,
};
