import { IVideo } from '@/domain/entities/video';
import { IVideoService } from '@/services/VideoService';

export default class CreateVideoUseCase {
    private videoService: IVideoService;

    constructor(videoService: IVideoService) {
        this.videoService = videoService;
    }

    async execute(data: Omit<IVideo, 'id'>) {
        return this.videoService.create(data);
    }
}
