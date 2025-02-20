import { Status } from '@/domain/entities/status';

export interface Pagination {
    search: string;
    status: Status;
    page: number;
    limit: number;
    skip: number;
}

export function withPagination(
    handler: (request: Request, pagination: Pagination) => Promise<Response>,
) {
    return async (request: Request) => {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const skip = (page - 1) * limit;
        const search = searchParams.get('search') || '';

        const statusParam = searchParams.get('status');
        const status: Status = Object.values(Status).includes(statusParam as Status)
            ? (statusParam as Status)
            : Status.EM_ANALISE;

        return handler(request, { search, status, page, limit, skip });
    };
}
