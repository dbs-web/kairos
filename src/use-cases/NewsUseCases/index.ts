// DB
import db from '@/infrastructure/database/DatabaseFactory';

// Repository
import NewsRepository from '@/repositories/NewsRepository';

// Service
import NewsService from '@/services/NewsService';

import UpdateNewsStatusUseCase from './UpdateNewsStatusUseCase';
import GetPaginatedNewsUseCase from './GetPaginatedNewsUseCase';
import CreateManyNewsUseCase from './CreateManyNewsUseCase';

const newsRepository = new NewsRepository(db);
const newsService = new NewsService(newsRepository);

const updateNewsStatusUseCase = new UpdateNewsStatusUseCase(newsService);
const getPaginatedNewsUseCase = new GetPaginatedNewsUseCase(newsService);
const createManyNewsUseCase = new CreateManyNewsUseCase(newsService);

export { updateNewsStatusUseCase, getPaginatedNewsUseCase, createManyNewsUseCase };
