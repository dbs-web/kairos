import { Status } from '@/domain/entities/status';
import { IBriefingService } from '@/services/BriefingService';

export default class GetPaginatedBriefingsUseCase {
    private briefingService: IBriefingService;

    constructor(briefingService: IBriefingService) {
        this.briefingService = briefingService;
    }

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
