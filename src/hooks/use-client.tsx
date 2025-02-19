import { IUser } from '@/domain/entities/user';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

export const useClients = (filterBy?: string, filterValue?: string) => {
    const queryClient = useQueryClient();

    const { data: users, ...queryInfo } = useQuery({
        queryKey: ['users', filterBy, filterValue],
        queryFn: () => fetchUsers(filterBy, filterValue),
    });

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

    return {
        users,
        addUser: addMutation.mutate,
        updateUser: updateMutation.mutate,
        deleteUser: deleteMutation.mutate,
        ...queryInfo,
    };
};
