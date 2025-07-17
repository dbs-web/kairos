import { IUser } from '@/domain/entities/user';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePagination } from './use-pagination';
import { useFetchData } from './use-fetch-data';

const fetchUsers = async (filterBy?: string, filterValue?: string): Promise<IUser[]> => {
    let query = '';
    if (filterBy && filterValue) query = `?filterBy=${filterBy}&filterValue=${filterValue}`;

    const res = await fetch(`/api/user${query}`);
    const data = await res.json();
    return data.data;
};

const addUser = async (user: Omit<IUser, 'id'>) => {
    const res = await fetch('/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    const data = await res.json();
    return data.data;
};

const updateUser = async (user: Partial<IUser>): Promise<IUser> => {
    const res = await fetch('/api/user', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    const data = await res.json();
    return data.data;
};

const deleteUser = async (id: number) => {
    const res = await fetch(`/api/user`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: id }),
    });
    const data = await res.json();
    return data.data;
};

export const useClients = () => {
    const queryClient = useQueryClient();

    const limits = {
        sm: 5,
        md: 10,
        lg: 15,
        xl: 20,
    };

    const { page, setPage, limit } = usePagination(limits);

    const { data, isFetching, refetch } = useFetchData<IUser>('user', { page, limit }, 'user');

    const addMutation = useMutation({
        mutationFn: addUser,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const logoutUsersMutation = useMutation({
        mutationFn: async (userIds: number[]) => {
            const response = await fetch('/api/user/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIds })
            });
            if (!response.ok) throw new Error('Failed to logout users');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const logoutAllUsersMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/user/logout-all', {
                method: 'POST'
            });
            if (!response.ok) throw new Error('Failed to logout all users');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const users = data?.data || [];
    const totalPages = data?.pagination?.totalPages || 1;

    return {
        users,
        addUser: addMutation.mutate,
        updateUser: updateMutation.mutate,
        deleteUser: deleteMutation.mutate,
        page,
        setPage,
        totalPages,
        limit,
        isFetching,
        logoutUsers: logoutUsersMutation.mutate,
        logoutAllUsers: logoutAllUsersMutation.mutate,
        isLoggingOut: logoutUsersMutation.isPending || logoutAllUsersMutation.isPending,
    };
};

