import { IBriefingService } from '@/services/BriefingService';

export default class GetBriefingsUseCase {
    private briefingService: IBriefingService;

    constructor(briefingService: IBriefingService) {
        this.briefingService = briefingService;
    }

    async byId({ id, userId }: { id: number; userId: number }) {
        return this.briefingService.findById({ id, userId });
    }
}
