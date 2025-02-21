import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Hooks
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

// UI
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
import { Textarea } from '../ui/textarea';
import { useState } from 'react';
import { ImSpinner8 } from 'react-icons/im';

// Entities

const formSchema = z.object({
    title: z.string().min(5, { message: 'O título deve ter pelo menos 5 caracteres.' }),
    prompt: z.string().min(10, { message: 'Insira uma instrução de pelo menos 10 caracters' }),
});

export default function CustomPrompt() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            prompt: '',
        },
    });

    const { toast } = useToast();

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            //api call
            const res = await fetch('/api/briefings', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok)
                toast({
                    title: 'Seu conteúdo está sendo gerado.',
                    description: `Em breve você receberá o seu texto na aba de Aprovações.`,
                });
            else {
                const error = await res.json();
                throw new Error(error.message);
            }
        } catch (e) {
            toast({
                title: 'Erro',
                description: `${e instanceof Error ? e.message : e}`,
            });
        }

        form.reset();
        setIsSubmitting(false);
    };

    return (
        <div className="flex h-[450px] flex-col rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-900">Criação de Vídeo</h2>

            {!isSubmitting ? (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-6 flex flex-col gap-y-5"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-neutral-700">
                                        Título
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isSubmitting}
                                            placeholder="Título do seu vídeo"
                                            className="mt-1.5 border-neutral-200 placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary/20"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="prompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-neutral-700">
                                        Instruções
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            className="mt-1.5 min-h-[160px] resize-none border-neutral-200 placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary/20"
                                            placeholder="Sobre o que deseja que o vídeo aborde?"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="mt-2 h-10 w-full rounded-lg bg-primary text-white transition-colors duration-200 hover:bg-primary/90"
                        >
                            Criar Vídeo
                        </Button>
                    </form>
                </Form>
            ) : (
                <div className="grid flex-1 place-items-center">
                    <div className="flex flex-col items-center gap-3">
                        <ImSpinner8 className="animate-spin text-3xl text-primary" />
                        <span className="text-sm text-neutral-600">Gerando seu vídeo...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
