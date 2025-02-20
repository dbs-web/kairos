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
        <div className="flex flex-col gap-y-8 rounded-lg border bg-white p-5 shadow-lg h-[450px]">
            <h2 className="text-2xl font-medium text-neutral-700">Criação de Vídeo</h2>
            {
            !isSubmitting ? 
            <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="title">Título</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isSubmitting} placeholder='Título do seu vídeo'/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="prompt">Instruções</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        className="h-40"
                                        placeholder="Sobre o que deseja que o vídeo aborde?"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        Criar Vídeo
                    </Button>
                </form>
            </Form>
            : 
            <div className="w-full h-full grid place-items-center bg-neutral-50 animate-pulse">
                <ImSpinner8 className="animate-spin text-4xl text-primary" />
            </div>
            }
        </div>
    );
}
