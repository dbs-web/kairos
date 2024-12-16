'use client';

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
import { useToast } from '@/hooks/use-toast';
interface ClientFormProps {
    setModalOpen: (isOpen: boolean) => void;
}

const formSchema = z
    .object({
        name: z.string().min(4, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
        email: z.string().email({ message: 'Insira um e-mail válido.' }),
        password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
        passwordConfirmation: z
            .string()
            .min(6, { message: 'A confirmação de senha deve ter pelo menos 6 caracteres.' }),
        avatarGroupId: z.string().min(1, { message: 'O avatarGroupId é obrigatório.' }),
    })
    .superRefine(({ passwordConfirmation, password }, ctx) => {
        if (passwordConfirmation !== password) {
            ctx.addIssue({
                code: 'custom',
                message: 'A confirmação de senha deve ser igual à senha',
                path: ['passwordConfirmation'],
            });
        }
    });

export default function ClientForm({ setModalOpen }: ClientFormProps) {
    const { addUser } = useClients();
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            avatarGroupId: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const res = await fetch(`/api/heygen/check-group?groupId=${data.avatarGroupId}`, {
            method: 'GET',
        });

        const result = await res.json();

        if (!res.ok || result?.data?.error) {
            toast({
                title: 'Grupo de Avatar inválido.',
                description: 'Não foi possível criar o usuário.',
            });
            return;
        }

        addUser({
            name: data.name,
            email: data.email,
            password: data.password,
            role: 'user',
            avatarGroupId: data.avatarGroupId,
        });

        setModalOpen(false);

        toast({
            title: 'Cliente criado com sucesso!',
            description: 'O avatarGroupId foi verificado com sucesso!',
        });
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
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Senha" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="passwordConfirmation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirmação de Senha</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Confirme sua senha"
                                    {...field}
                                />
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
                    Cadastrar Cliente
                </Button>
            </form>
        </Form>
    );
}
