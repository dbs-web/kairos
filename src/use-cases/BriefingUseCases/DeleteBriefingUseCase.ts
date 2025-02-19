import { IBriefingService } from '@/services/BriefingService';

export default class DeleteBriefingUseCase {
    private briefingService: IBriefingService;

    constructor(briefingService: IBriefingService) {
        this.briefingService = briefingService;
    }

    async execute({ id, userId }: { id: number; userId: number }) {
        return this.briefingService.delete({ id, userId });
    }
}
