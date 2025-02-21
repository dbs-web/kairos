import { IBriefing } from '@/domain/entities/briefing';
import pollingClient from '@/infrastructure/polling/PollingClientSingleton';
import { IBriefingService } from '@/services/BriefingService';

export default class UpdateBriefingUseCase {
    private briefingService: IBriefingService;
    private pollingClient = pollingClient;

    constructor(briefingService: IBriefingService) {
        this.briefingService = briefingService;
    }

    /**
     * Update briefing
     * @param id Briefing ID
     * @param userId User ID
     * @param data Briefing data
     * @param poll Whether to poll
     *
     * @returns Updated briefing
     * @throws Error if briefing not found
     */
    async execute({
        id,
        userId,
        data,
        poll = false,
    }: {
        id: number;
        userId: number;
        data: Partial<IBriefing>;
        poll?: boolean;
    }) {
        const briefing = await this.briefingService.update({ id, userId, data });

        if (!briefing) {
            throw new Error('Briefing not found');
        }

        if (poll) {
            await this.pollingClient.insertPollingData({
                userId: briefing.userId,
                dataType: 'briefing',
            });
        }

        return briefing;
    }

    /**
     * Update briefing (DANGEROUS, bypasses user ID check)
     * @param id Briefing ID
     * @param data Briefing data
     * @param poll Whether to poll
     *
     * @returns Updated briefing
     */
    async dangerousUpdate({
        id,
        data,
        poll = false,
    }: {
        id: number;
        data: Partial<IBriefing>;
        poll?: boolean;
    }) {
        const briefing = await this.briefingService.update({
            id,
            data,
        });

        if (!briefing) {
            throw new Error('Briefing not found');
        }

        if (poll) {
            await this.pollingClient.insertPollingData({
                userId: briefing.userId,
                dataType: 'briefing',
            });
        }

        return briefing;
    }
}
