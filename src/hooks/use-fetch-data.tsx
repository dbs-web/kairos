import { useQuery } from '@tanstack/react-query';
import { useSearchData } from '@/hooks/use-search-data';

interface FetchDataParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string | null;
    [key: string]: any;
}

export const useFetchData = <T,>(
    endpoint: string,
    additionalParams: FetchDataParams = {},
    queryKey: string,
) => {
    const { searchText, selectedStatus } = useSearchData();

    const buildUrl = () => {
        const url = new URL(`/api/${endpoint}`, window.location.origin);

        const params: FetchDataParams = {
            ...additionalParams,
            search: searchText || additionalParams.search,
            status: selectedStatus || additionalParams.status,
        };

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value.toString());
            }
        });

        return url.toString();
    };

    return useQuery({
        queryKey: [queryKey, searchText, selectedStatus, ...Object.values(additionalParams)],
        queryFn: async (): Promise<{ data: T[]; pagination: { totalPages: number } }> => {
            const response = await fetch(buildUrl());

            if (!response.ok) throw new Error(`Erro ao buscar ${endpoint}`);
            return response.json();
        },
    });
};
