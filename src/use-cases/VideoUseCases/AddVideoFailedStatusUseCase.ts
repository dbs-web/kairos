import { HeyGenStatus } from '@/domain/entities/video';
import { IPollingClient } from '@/infrastructure/polling/PollingClient';
import { IVideoService } from '@/services/VideoService';

import pollingClient from '@/infrastructure/polling/PollingClientSingleton';

export default class AddVideoFailedStatusUseCase {
    private videoService: IVideoService;
    private pollingClient: IPollingClient;

    constructor(videoService: IVideoService) {
        this.videoService = videoService;
        this.pollingClient = pollingClient;
    }

    async execute(id: number) {
        const video = await this.videoService.update({
            id,
            data: {
                heygenStatus: HeyGenStatus.FAILED,
            },
        });

        if (!video) {
            throw new Error('Video not found');
        }

        await this.pollingClient.insertPollingData({
            userId: video.userId,
            dataType: 'video',
        });

        return video;
    }
}
