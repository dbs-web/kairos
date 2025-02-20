import { HeyGenStatus } from '@/domain/entities/video';
import { IVideoService } from '@/services/VideoService';

export default class AddVideoUrlUseCase {
    private videoService: IVideoService;

    constructor(videoService: IVideoService) {
        this.videoService = videoService;
    }

    async execute({
        heygenVideoId,
        url,
        heygenStatus,
    }: {
        heygenVideoId: string;
        url: string;
        heygenStatus: HeyGenStatus;
    }) {
        return this.videoService.updateByHeyGenId({
            heygenVideoId,
            data: {
                url,
                heygenStatus,
            },
        });
    }
}
