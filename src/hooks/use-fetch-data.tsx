import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchData } from '@/hooks/use-search-data';
import { useEffect, useRef } from 'react';

interface FetchDataParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string | null;
    pollingEnabled?: boolean;
    [key: string]: any;
}

export const useFetchData = <T,>(
    endpoint: string,
    additionalParams: FetchDataParams = {},
    queryKey: string,
) => {
    const { searchText, selectedStatus } = useSearchData();
    const pollingRef = useRef<NodeJS.Timeout | null>(null);
    const { pollingEnabled = false } = additionalParams;

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

    const query = useQuery({
        queryKey: [queryKey, searchText, selectedStatus, ...Object.values(additionalParams)],
        queryFn: async (): Promise<{ data: T[]; pagination: { totalPages: number } }> => {
            const response = await fetch(buildUrl());

            if (!response.ok) throw new Error(`Erro ao buscar ${endpoint}`);
            return response.json();
        },
        placeholderData: keepPreviousData,
    });

    const checkForUpdates = async () => {
        const response = await fetch(`/api/poll?dataType=${queryKey}`);
        const { data } = await response.json();

        if (data.shouldRefetch) {
            query.refetch();
        }
    };

    useEffect(() => {
        if (pollingEnabled && !pollingRef.current) {
            pollingRef.current = setInterval(checkForUpdates, 10000);
        }

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, [pollingEnabled]);

    return query;
};
