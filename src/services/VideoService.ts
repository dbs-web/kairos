import { IVideo } from '@/domain/entities/video';
import { IVideoRepository } from '@/repositories/VideoRepository';
import { FindPaginatedServiceArgs, IPaginatedDataService } from './PaginatedDataService';
import { ServiceError } from '@/shared/errors';

interface FindByIdArgs {
    id: number;
    userId: number;
}

interface FindByHeygenVideoId {
    heygenVideoId: string;
}

interface UpdateVideoArgs {
    id: number;
    userId?: number;
    data: Partial<IVideo>;
}

interface DeleteVideoArgs {
    id: number;
    userId: number;
}

export interface IVideoService extends IPaginatedDataService<IVideo> {
    create(videoData: Omit<IVideo, 'id'>): Promise<IVideo>;
    findById({ id, userId }: FindByIdArgs): Promise<IVideo>;
    findByHeyGenId({ heygenVideoId }: FindByHeygenVideoId): Promise<IVideo>;
    update(args: UpdateVideoArgs): Promise<IVideo>;
    updateByHeyGenId({
        heygenVideoId,
        data,
    }: {
        heygenVideoId: string;
        data: Partial<IVideo>;
    }): Promise<IVideo>;
    delete(args: DeleteVideoArgs): Promise<IVideo>;
}

export default class VideoService implements IVideoService {
    private repository: IVideoRepository;

    constructor(suggestionRepository: IVideoRepository) {
        this.repository = suggestionRepository;
    }

    async findById({ id, userId }: FindByIdArgs): Promise<IVideo> {
        const video = await this.repository.findUnique({
            criteria: { id, userId },
        });

        if (!video) {
            throw new ServiceError('Video with the provided id was not found');
        }

        return video;
    }

    async findByHeyGenId({ heygenVideoId }: FindByHeygenVideoId): Promise<IVideo> {
        const video = await this.repository.findUnique({
            criteria: {
                heygenVideoId,
            },
        });

        if (!video) {
            throw new ServiceError('Video with the provided HeygenID was not found');
        }

        return video;
    }

    async findWithQueryAndPagination({
        userId,
        skip,
        take,
        orderBy,
    }: FindPaginatedServiceArgs): Promise<[IVideo[], number]> {
        const criteria = {
            userId,
        };

        return Promise.all([
            this.repository.find({ criteria, skip, take, orderBy }),
            this.repository.count({ criteria }),
        ]);
    }

    async create(suggestionData: Omit<IVideo, 'id'>): Promise<IVideo> {
        return this.repository.create(suggestionData);
    }

    async update({ id, userId, data }: UpdateVideoArgs): Promise<IVideo> {
        const video = await this.repository.update({
            criteria: {
                id,
                userId,
            },
            data,
        });

        if (!video) {
            throw new ServiceError(
                'Video with the provided id and user_id was not found, update failed.',
            );
        }

        return video;
    }

    async updateByHeyGenId({
        heygenVideoId,
        data,
    }: {
        heygenVideoId: string;
        data: Partial<IVideo>;
    }): Promise<IVideo> {
        const video = await this.repository.update({
            criteria: {
                heygenVideoId,
            },
            data,
        });

        if (!video) {
            throw new ServiceError('Video with the provided HeygenVideoID was not found');
        }

        return video;
    }

    async delete({ id, userId }: DeleteVideoArgs): Promise<IVideo> {
        const video = await this.repository.delete({
            criteria: {
                id,
                userId,
            },
        });

        if (!video) {
            throw new ServiceError('Video with the provided id and user_id was not found');
        }

        return video;
    }
}
