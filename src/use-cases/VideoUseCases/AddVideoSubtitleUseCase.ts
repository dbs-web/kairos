import { IVideoService } from '@/services/VideoService';

export default class AddVideoSubtitleUseCase {
    private videoService: IVideoService;

    constructor(videoService: IVideoService) {
        this.videoService = videoService;
    }

    async execute({ id, subtitle }: { id: number; subtitle: string }) {
        return this.videoService.update({
            id,
            data: {
                legenda: subtitle,
            },
        });
    }
}
