import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Hooks
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import LoadingSubmission from './LoadingSubmission';
import { useState } from 'react';

// UI
import { MdPlayCircleFilled } from 'react-icons/md';
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

const formSchema = z.object({
    title: z.string().min(5, { message: 'O título deve ter pelo menos 5 caracteres.' }),
    prompt: z.string().min(10, { message: 'Insira uma instrução de pelo menos 10 caracters' }),
});

export default function CreateWithAIForm() {
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

    if (isSubmitting) {
        return <LoadingSubmission />;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-y-5">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">
                                Título
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={isSubmitting}
                                    placeholder="Título do seu vídeo"
                                    className="mt-1.5 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
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
                            <FormLabel className="text-sm font-medium text-foreground">
                                Instruções
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    className="mt-1.5 min-h-[160px] resize-none border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                                    placeholder="Sobre o que deseja que o vídeo aborde?"
                                />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="create-video-button mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg"
                >
                    <MdPlayCircleFilled className="text-xl text-white" />
                    <span className="text-white">Criar Vídeo</span>
                </Button>
            </form>
        </Form>
    );
}
