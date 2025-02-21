import { Status } from '@/domain/entities/status';
import { IBriefingService } from '@/services/BriefingService';

export default class GetPaginatedBriefingsUseCase {
    private briefingService: IBriefingService;

    constructor(briefingService: IBriefingService) {
        this.briefingService = briefingService;
    }

    /** Get briefings with pagination
     * @param userId User ID
     * @param statuses Briefing statuses
     * @param search Search query
     * @param skip Number of items to skip
     * @param limit Number of items to take
     *
     * @returns [briefings, total] tuple with briefings and total count
     */
    async execute({
        userId,
        statuses,
        search,
        skip,
        limit,
    }: {
        userId: number;
        statuses: Status[];
        search: string;
        skip: number;
        limit: number;
    }) {
        return this.briefingService.findWithQueryAndPagination({
            userId,
            statuses,
            query: search,
            skip,
            take: limit,
        });
    }
}
