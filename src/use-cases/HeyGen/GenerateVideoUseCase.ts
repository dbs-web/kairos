import HeyGenAdapter, { GenerateVideoArgs } from '@/adapters/HeygenAdapter';
import { HeyGenStatus } from '@/domain/entities/video';
import { UseCaseError } from '@/shared/errors';

export default class GenerateVideoUseCase {
    private heyGenAdapter: HeyGenAdapter;

    constructor(heyGenAdapter: HeyGenAdapter) {
        this.heyGenAdapter = heyGenAdapter;
    }

    async execute(args: Omit<GenerateVideoArgs, 'HeyGenStatus'>): Promise<string> {
        try {
            const res = await this.heyGenAdapter.generateVideoRequest(args);

            if (!res.ok) {
                const errorData = await res.json();
                throw new UseCaseError('Video generation failed', errorData.error as Error);
            }

            const responseData = await res.json();
            const heygenVideoId = responseData.data.video_id;

            if (!heygenVideoId) {
                throw new UseCaseError("Invalid Response from HeyGen's API");
            }

            return heygenVideoId;
        } catch (error) {
            throw new UseCaseError('HeyGen video request failed', error as Error);
        }
    }
}
