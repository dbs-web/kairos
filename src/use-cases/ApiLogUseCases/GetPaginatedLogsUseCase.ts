import { IApiLogService } from '@/services/ApiLogService';

export default class GetPaginatedLogsUseCase {
    private apiLogService: IApiLogService;

    constructor(apiLogService: IApiLogService) {
        this.apiLogService = apiLogService;
    }

    async execute({ search, skip, limit }: { search: string; skip: number; limit: number }) {
        return this.apiLogService.findWithQueryAndPagination({
            query: search,
            skip,
            take: limit,
        });
    }
}
