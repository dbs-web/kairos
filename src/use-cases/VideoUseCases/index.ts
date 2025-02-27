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
import GetVideosUseCase from './GetVideosUseCase';

const videoRepository = new VideoRepository(db);
const videoService = new VideoService(videoRepository);

const getVideosUseCase = new GetVideosUseCase(videoService);
const createVideoUseCase = new CreateVideoUseCase(videoService);
const getPaginatedVideosUseCase = new GetPaginatedVideosUseCase(videoService);
const addVideoSubtitleUseCase = new AddVideoSubtitleUseCase(videoService);
const addVideoUrlUseCase = new AddVideoUrlUseCase(videoService);
const addVideoFailedStatusUseCase = new AddVideoFailedStatusUseCase(videoService);

export {
    getVideosUseCase,
    createVideoUseCase,
    getPaginatedVideosUseCase,
    addVideoSubtitleUseCase,
    addVideoUrlUseCase,
    addVideoFailedStatusUseCase,
};
