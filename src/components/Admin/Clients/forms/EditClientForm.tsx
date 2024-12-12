'use client';

import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useClients } from '@/hooks/use-client';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { IUser } from '@/types/user';

interface EditClientFormProps {
    client: IUser;
    setModalOpen: (isOpen: boolean) => void;
}

const formSchema = z.object({
    name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
    email: z.string().email({ message: 'Insira um e-mail válido.' }),
    avatarGroupId: z.string().min(1, { message: 'O avatarGroupId é obrigatório.' }),
});

export default function EditClientForm({ client, setModalOpen }: EditClientFormProps) {
    const { updateUser } = useClients();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: client.name,
            email: client.email,
            avatarGroupId: client.avatarGroupId,
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const res = await fetch(`/api/heygen/check-group?groupId=${data.avatarGroupId}`, {
            method: 'GET',
        });

        const result = await res.json();

        if (!res.ok || result?.message) {
            toast.error('O Avatar Group ID é inválido. Não foi possível atualizar o usuário.');
            return;
        }

        await updateUser({
            _id: client._id,
            name: data.name,
            email: data.email,
            avatarGroupId: data.avatarGroupId,
        });

        setModalOpen(false);
        toast.success('Cliente atualizado com sucesso!');
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome do Cliente" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="email@exemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="avatarGroupId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Avatar Group ID</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="ID do grupo de avatares no Heygen"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    Atualizar Cliente
                </Button>
            </form>
        </Form>
    );
}
