import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { ISuggestion } from '@/domain/entities/suggestion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { MdSave, MdThumbUp, MdThumbDown, MdClose } from 'react-icons/md';

interface SuggestionApproachDialogProps {
    suggestion: ISuggestion;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (suggestionId: number, approach: string, stance?: 'APOIAR' | 'REFUTAR') => void;
    initialApproach?: string;
    initialStance?: 'APOIAR' | 'REFUTAR';
}

export default function SuggestionApproachDialog({ 
    suggestion, 
    open, 
    onOpenChange, 
    onSave, 
    initialApproach = '',
    initialStance
}: SuggestionApproachDialogProps) {
    const [approach, setApproach] = useState<string>(initialApproach);
    const [stance, setStance] = useState<'APOIAR' | 'REFUTAR' | null>(initialStance || null);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!approach.trim()) {
            toast({
                title: 'A abordagem não pode estar vazia',
                description: 'Por favor, descreva como deseja que a sugestão seja abordada.',
                variant: 'destructive',
            });
            return;
        }

        setIsSaving(true);
        try {
            onSave(suggestion.id, approach.trim(), stance || undefined);
            toast({
                title: 'Abordagem salva com sucesso!',
                description: stance 
                    ? `A abordagem foi definida para ${stance === 'APOIAR' ? 'apoiar' : 'refutar'} esta sugestão.`
                    : 'A abordagem foi definida para esta sugestão.',
            });
            onOpenChange(false);
        } catch (e) {
            toast({
                title: 'Erro ao salvar abordagem',
                description: e instanceof Error ? e.message : 'Ocorreu um erro inesperado',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setApproach(initialApproach);
        setStance(initialStance || null);
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
                        <h4 className="font-medium text-foreground mb-2">Sugestão selecionada:</h4>
                        <div className="flex items-center gap-3 mb-2">
                            <p className="text-sm font-medium text-foreground">@{suggestion.name_profile}</p>
                            <span className="text-xs text-muted-foreground">
                                {new Date(suggestion.date).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                        <p className="text-sm text-foreground/80 line-clamp-3">{suggestion.post_text}</p>
                    </div>

                    {/* Stance Selection - Hybrid: Gray default, Thematic selected/hover */}
                    <div className="mb-6">
                        <h4 className="font-medium text-foreground mb-3">Sua posição sobre esta sugestão (opcional):</h4>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setStance('APOIAR')}
                                className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all duration-200 ${
                                    stance === 'APOIAR'
                                        ? 'border-teal-500 bg-teal-500/10 text-teal-500'
                                        : 'border-slate-600 bg-transparent text-slate-400 hover:border-teal-500 hover:bg-teal-500/10 hover:text-teal-500'
                                }`}
                            >
                                <MdThumbUp className="text-xl" />
                                <span className="font-medium">Apoiar</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setStance('REFUTAR')}
                                className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all duration-200 ${
                                    stance === 'REFUTAR'
                                        ? 'border-amber-600 bg-amber-600/10 text-amber-600'
                                        : 'border-slate-600 bg-transparent text-slate-400 hover:border-amber-600 hover:bg-amber-600/10 hover:text-amber-600'
                                }`}
                            >
                                <MdThumbDown className="text-xl" />
                                <span className="font-medium">Refutar</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setStance(null)}
                                className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all duration-200 ${
                                    stance === null
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-slate-600 bg-transparent text-slate-400 hover:border-primary hover:bg-primary/10 hover:text-primary'
                                }`}
                            >
                                <MdClose className="text-xl" />
                                <span className="font-medium">Neutro</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <h4 className="font-medium text-foreground mb-2">
                            Como você quer abordar esta sugestão?
                        </h4>
                        <Textarea
                            className="min-h-[200px] resize-none border-border bg-muted/10 text-foreground focus-visible:ring-primary"
                            value={approach}
                            onChange={(e) => setApproach(e.target.value)}
                            placeholder="Digite como quer abordar essa sugestão"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="border-border text-foreground hover:bg-muted"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSaving || !approach.trim()}
                        className="gap-2 bg-gradient-to-r from-[#0085A3] to-primary text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 hover:text-white"
                    >
                        {isSaving ? (
                            <span className="text-white">Salvando...</span>
                        ) : (
                            <>
                                <MdSave className="text-lg text-white" />
                                <span className="text-white">Salvar</span>
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
