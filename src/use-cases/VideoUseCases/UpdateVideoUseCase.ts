import { IVideo } from '@/domain/entities/video';
import { IVideoService } from '@/services/VideoService';

export default class {
    constructor(private videoService: IVideoService) {}

    async execute({ id, data }: { id: number; data: Partial<IVideo> }): Promise<IVideo> {
        return this.videoService.update({ id, data });
    }
}
