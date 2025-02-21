import { IBriefing } from '@/domain/entities/briefing';
import { IBriefingService } from '@/services/BriefingService';

export default class GetBriefingsUseCase {
    private briefingService: IBriefingService;

    constructor(briefingService: IBriefingService) {
        this.briefingService = briefingService;
    }

    async byId({ id, userId }: { id: number; userId: number }): Promise<IBriefing> {
        const briefing = await this.briefingService.findById({ id, userId });

        if (!briefing) {
            throw new Error('Briefing not found');
        }

        return briefing;
    }
}
