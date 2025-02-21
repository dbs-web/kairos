import { IVideo } from '@/domain/entities/video';
import { IVideoService } from '@/services/VideoService';

export default class CreateVideoUseCase {
    private videoService: IVideoService;

    constructor(videoService: IVideoService) {
        this.videoService = videoService;
    }

    /**
     * Create video
     * @param data Video data
     *
     * @returns Created video
     * @throws Error if video not found
     */
    async execute(data: Omit<IVideo, 'id'>) {
        const video = await this.videoService.create(data);

        if (!video) {
            throw new Error('Video not found');
        }

        return video;
    }
}
