'use client';

// Utils
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Hooks
import { useForm } from 'react-hook-form';
import { useClients } from '@/hooks/use-client';

// Components
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

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passwordConfirmation: '',
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        addUser({
            name: data.name,
            email: data.email,
            password: data.password,
            role: 'user',
        });

        setModalOpen(false);

        toast('Cliente criado com sucesso!', {
            description:
                'Lembre-se de adicionar os avatares dele, clicando no símbolo de avatar no card dele',
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

                <Button type="submit" className="w-full">
                    Cadastrar Cliente
                </Button>
            </form>
        </Form>
    );
}
