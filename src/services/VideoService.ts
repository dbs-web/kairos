import { IVideo } from '@/domain/entities/video';
import { IVideoRepository } from '@/repositories/VideoRepository';
import { FindPaginatedServiceArgs, IPaginatedDataService } from './PaginatedDataService';

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
    create(videoData: Omit<IVideo, 'id'>): Promise<IVideo | undefined>;
    findById({ id, userId }: FindByIdArgs): Promise<IVideo | undefined>;
    findByHeyGenId({ heygenVideoId }: FindByHeygenVideoId): Promise<IVideo | undefined>;
    update(args: UpdateVideoArgs): Promise<IVideo | undefined>;
    updateByHeyGenId({
        heygenVideoId,
        data,
    }: {
        heygenVideoId: string;
        data: Partial<IVideo>;
    }): Promise<IVideo | undefined>;
    delete(args: DeleteVideoArgs): Promise<IVideo | undefined>;
}

export default class VideoService implements IVideoService {
    private repository: IVideoRepository;

    constructor(suggestionRepository: IVideoRepository) {
        this.repository = suggestionRepository;
    }

    async findById({ id, userId }: FindByIdArgs): Promise<IVideo> {
        return await this.repository.findUnique({
            criteria: { id, userId },
        });
    }

    async findByHeyGenId({ heygenVideoId }: FindByHeygenVideoId): Promise<IVideo | undefined> {
        return await this.repository.findUnique({
            criteria: {
                heygenVideoId,
            },
        });
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

    async create(suggestionData: Omit<IVideo, 'id'>): Promise<IVideo | undefined> {
        return this.repository.create(suggestionData);
    }

    async update({ id, userId, data }: UpdateVideoArgs): Promise<IVideo | undefined> {
        return this.repository.update({
            criteria: {
                id,
                userId,
            },
            data,
        });
    }

    async updateByHeyGenId({
        heygenVideoId,
        data,
    }: {
        heygenVideoId: string;
        data: Partial<IVideo>;
    }): Promise<IVideo | undefined> {
        return this.repository.update({
            criteria: {
                heygenVideoId,
            },
            data,
        });
    }

    async delete({ id, userId }: DeleteVideoArgs): Promise<IVideo | undefined> {
        return this.repository.delete({
            criteria: {
                id,
                userId,
            },
        });
    }
}
