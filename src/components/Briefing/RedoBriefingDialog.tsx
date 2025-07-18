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
            <DialogTrigger asChild>
                <span className="inline-block w-full">{children}</span>
            </DialogTrigger>
            <DialogContent className="border-border bg-card text-foreground sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle className="text-xl text-foreground">{briefing.title}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Digite as instruções para nova abordagem do briefing. Seja específico sobre as
                        mudanças desejadas.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <Textarea
                        className="min-h-[200px] resize-none border-border bg-muted/10 text-foreground focus-visible:ring-primary"
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
                        className="border-border text-foreground hover:bg-muted"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleRedoBriefing}
                        disabled={isSubmitting || !instruction.trim()}
                        className="gap-2 bg-gradient-to-r from-[#0085A3] to-primary text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                    >
                        {isSubmitting ? (
                            'Enviando...'
                        ) : (
                            <>
                                <MdRefresh className="text-lg" />
                                Enviar nova abordagem
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
