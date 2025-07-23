import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { INews } from '@/domain/entities/news';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { MdSend } from 'react-icons/md';

interface NewsApproachDialogProps {
    news: INews;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSendToProduction: (newsId: number, approach: string) => Promise<void>;
    initialApproach?: string;
}

export default function NewsApproachDialog({
    news,
    open,
    onOpenChange,
    onSendToProduction,
    initialApproach = ''
}: NewsApproachDialogProps) {
    const [approach, setApproach] = useState<string>(initialApproach);
    const [isSending, setIsSending] = useState(false);
    const { toast } = useToast();

    const handleSendToProduction = async () => {
        if (!approach.trim()) {
            toast({
                title: 'A abordagem não pode estar vazia',
                description: 'Por favor, descreva como deseja que a notícia seja abordada.',
                variant: 'destructive',
            });
            return;
        }

        setIsSending(true);
        try {
            await onSendToProduction(news.id, approach.trim());
            toast({
                title: 'Enviado para produção com sucesso!',
                description: 'A notícia foi enviada para produção. Você receberá o resultado na página de Aprovações em breve.',
            });
            onOpenChange(false);
        } catch (e) {
            toast({
                title: 'Erro ao enviar para produção',
                description: e instanceof Error ? e.message : 'Ocorreu um erro inesperado',
                variant: 'destructive',
            });
        } finally {
            setIsSending(false);
        }
    };

    const handleCancel = () => {
        setApproach(initialApproach);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] border-border bg-card text-foreground sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle className="text-xl text-foreground">
                        Defina sua abordagem
                    </DialogTitle>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto py-4">
                    <div className="mb-4 rounded-lg bg-muted/20 p-3">
                        <h4 className="font-medium text-foreground mb-2">Notícia selecionada:</h4>
                        <p className="text-sm text-foreground/80 line-clamp-2">{news.title}</p>
                    </div>
                    
                    <Textarea
                        className="min-h-[200px] resize-none border-border bg-muted/10 text-foreground focus-visible:ring-primary"
                        value={approach}
                        onChange={(e) => setApproach(e.target.value)}
                        placeholder="Digite como quer que essa notícia seja abordada"
                    />
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSending}
                        className="border-border text-foreground hover:bg-muted"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSendToProduction}
                        disabled={isSending || !approach.trim()}
                        className="gap-2 bg-gradient-to-r from-[#0085A3] to-primary text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 hover:text-white"
                    >
                        {isSending ? (
                            <span className="text-white">Enviando...</span>
                        ) : (
                            <>
                                <MdSend className="text-lg text-white" />
                                <span className="text-white">Enviar para Produção</span>
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
