import { IVideo } from '@/domain/entities/video';
import { IVideoService } from '@/services/VideoService';

export default class GetVideosUseCase {
    constructor(private videoService: IVideoService) {}

    async byId({ id, userId }: { id: number; userId: number }): Promise<IVideo> {
        return this.videoService.findById({ id, userId });
    }

    async byHeyGenId({ heygenVideoId }: { heygenVideoId: string }): Promise<IVideo> {
        return this.videoService.findByHeyGenId({ heygenVideoId });
    }
}
