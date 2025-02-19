import { IBriefing } from '@/domain/entities/briefing';
import { IBriefingService } from '@/services/BriefingService';

export default class UpdateBriefingUseCase {
    private briefingService: IBriefingService;

    constructor(briefingService: IBriefingService) {
        this.briefingService = briefingService;
    }

    async execute({ id, userId, data }: { id: number; userId: number; data: Partial<IBriefing> }) {
        return this.briefingService.update({ id, userId, data });
    }

    async dangerousUpdate({ id, data }: { id: number; data: Partial<IBriefing> }) {
        return this.briefingService.update({
            id,
            data,
        });
    }
}
