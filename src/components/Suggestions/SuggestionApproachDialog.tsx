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
                    <div className="mb-4 rounded-lg p-3" style={{ backgroundColor: 'hsl(var(--muted) / 0.8)' }}>
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
                                className="flex items-center justify-center gap-1.5 rounded-lg border-2 p-2 transition-all duration-200"
                                style={stance === 'APOIAR' ? {
                                    borderColor: 'rgb(20, 184, 166)',
                                    backgroundColor: 'rgba(20, 184, 166, 0.1)',
                                    color: 'rgb(20, 184, 166)'
                                } : {
                                    borderColor: 'rgb(71, 85, 105)',
                                    backgroundColor: 'transparent',
                                    color: 'rgb(148, 163, 184)'
                                }}
                            >
                                <MdThumbUp className="text-base" />
                                <span className="font-medium text-sm">Apoiar</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setStance('REFUTAR')}
                                className="flex items-center justify-center gap-1.5 rounded-lg border-2 p-2 transition-all duration-200"
                                style={stance === 'REFUTAR' ? {
                                    borderColor: 'rgb(217, 119, 6)',
                                    backgroundColor: 'rgba(217, 119, 6, 0.1)',
                                    color: 'rgb(217, 119, 6)'
                                } : {
                                    borderColor: 'rgb(71, 85, 105)',
                                    backgroundColor: 'transparent',
                                    color: 'rgb(148, 163, 184)'
                                }}
                            >
                                <MdThumbDown className="text-base" />
                                <span className="font-medium text-sm">Refutar</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setStance(null)}
                                className="flex items-center justify-center gap-1.5 rounded-lg border-2 p-2 transition-all duration-200"
                                style={stance === null ? {
                                    backgroundColor: 'hsl(var(--primary) / 0.2)',
                                    borderColor: 'hsl(var(--primary))',
                                    color: 'white'
                                } : {
                                    backgroundColor: 'transparent',
                                    borderColor: 'rgb(71, 85, 105)',
                                    color: 'rgb(148, 163, 184)'
                                }}
                            >
                                <MdClose className="text-base" />
                                <span className="font-medium text-sm">Neutro</span>
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
