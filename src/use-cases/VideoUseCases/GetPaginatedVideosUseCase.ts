import { IVideoService } from '@/services/VideoService';

export default class GetPaginatedVideosUseCase {
    private videoService: IVideoService;

    constructor(videoService: IVideoService) {
        this.videoService = videoService;
    }

    async execute({ userId, skip, limit }: { userId: number; skip: number; limit: number }) {
        return this.videoService.findWithQueryAndPagination({
            userId,
            skip,
            take: limit,
        });
    }
}
