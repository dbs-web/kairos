import { IApiLog } from '@/domain/entities/api-log';
import { usePagination } from './use-pagination';
import { useFetchData } from './use-fetch-data';

export const useApiLogs = () => {
    const limits = {
        sm: 10,
        md: 12,
        lg: 14,
        xl: 16,
    };

    const { page, setPage, limit } = usePagination(limits);

    const { data, isLoading, refetch } = useFetchData<IApiLog>('logs', { page, limit }, 'logs');

    const logs = data?.data || [];
    const totalPages = data?.pagination?.totalPages || 1;

    return {
        logs,
        page,
        setPage,
        totalPages,
        limit,
        isLoading,
    };
};
