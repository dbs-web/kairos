import { HeyGenStatus } from '@/domain/entities/video';
import { IVideoService } from '@/services/VideoService';

export default class AddVideoFailedStatusUseCase {
    private videoService: IVideoService;

    constructor(videoService: IVideoService) {
        this.videoService = videoService;
    }

    async execute(id: number) {
        return this.videoService.update({
            id,
            data: {
                heygenStatus: HeyGenStatus.FAILED,
            },
        });
    }
}
