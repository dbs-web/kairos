import { HeyGenStatus } from '@/domain/entities/video';
import { IVideoService } from '@/services/VideoService';

export default class AddVideoUrlUseCase {
    private videoService: IVideoService;

    constructor(videoService: IVideoService) {
        this.videoService = videoService;
    }

    async execute({
        id,
        url,
        heygenStatus,
    }: {
        id: number;
        url: string;
        heygenStatus: HeyGenStatus;
    }) {
        return this.videoService.update({
            id,
            data: {
                url,
                heygenStatus,
            },
        });
    }
}
