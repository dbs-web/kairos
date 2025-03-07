import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { IBriefing } from '@/domain/entities/briefing';
import { useBriefing } from '@/hooks/use-briefing';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { MdRefresh } from 'react-icons/md';

interface RedoBriefingProps {
    briefing: IBriefing;
    children: React.ReactNode;
}

export default function RedoBriefingDialog({ briefing, children }: RedoBriefingProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [instruction, setInstruction] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { toast } = useToast();
    const { redoBriefing } = useBriefing();

    const handleRedoBriefing = async () => {
        if (!instruction.trim()) {
            toast({
                title: 'Por favor, forneça instruções para refazer o briefing',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await redoBriefing(briefing.id, instruction);
            toast({
                title: 'Solicitação de refação enviada com sucesso!',
                description: 'Aguarde alguns instantes até que sua refação seja feita.',
            });
            setOpen(false);
            setInstruction('');
        } catch (error) {
            toast({
                title: 'Erro ao enviar solicitação',
                description: 'Ocorreu um erro ao enviar sua solicitação de refação.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">{briefing.title}</DialogTitle>
                    <DialogDescription>
                        Digite as instruções para refazer o briefing. Seja específico sobre as
                        mudanças desejadas.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <Textarea
                        className="min-h-[200px] resize-none focus-visible:ring-primary"
                        placeholder="Descreva as alterações necessárias para o briefing..."
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                    />
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleRedoBriefing}
                        disabled={isSubmitting || !instruction.trim()}
                        className="gap-2"
                    >
                        {isSubmitting ? (
                            'Enviando...'
                        ) : (
                            <>
                                <MdRefresh className="text-lg" />
                                Refazer Briefing
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
