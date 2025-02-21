import { IBriefing } from '@/domain/entities/briefing';
import { IBriefingService } from '@/services/BriefingService';
import { UseCaseError } from '@/shared/errors';

export default class DeleteBriefingUseCase {
    private briefingService: IBriefingService;

    constructor(briefingService: IBriefingService) {
        this.briefingService = briefingService;
    }

    /**
     * Delete briefing
     * @param id Briefing ID
     * @param userId User ID
     *
     * @returns Deleted briefing
     * @throws UseCaseError if briefing not found
     */
    async execute({ id, userId }: { id: number; userId: number }): Promise<IBriefing> {
        const briefing = await this.briefingService.delete({ id, userId });

        if (!briefing) {
            throw new UseCaseError('Briefing not found');
        }

        return briefing;
    }
}
