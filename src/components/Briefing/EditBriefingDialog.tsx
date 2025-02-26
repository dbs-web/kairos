import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import { IBriefing } from '@/domain/entities/briefing';
import { useBriefing } from '@/hooks/use-briefing';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { FiEdit2 } from 'react-icons/fi';

interface EditBriefingDialogProps {
    briefing: IBriefing;
    children: React.ReactNode;
}

export default function EditBriefingDialog({ children, briefing }: EditBriefingDialogProps) {
    const [text, setText] = useState<string>(briefing.text ?? '');
    const [isSaving, setIsSaving] = useState(false);
    const { updateBriefing } = useBriefing();
    const [open, setOpen] = useState<boolean>(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!text.trim()) {
            toast({
                title: 'O conteúdo do briefing não pode estar vazio',
                variant: 'destructive',
            });
            return;
        }

        setIsSaving(true);
        try {
            await updateBriefing(briefing.id, text, briefing.status);
            toast({
                title: 'Briefing editado com sucesso!',
                description: 'As alterações foram salvas.',
            });
            setOpen(false);
        } catch (e) {
            toast({
                title: 'Erro ao editar o briefing',
                description: e instanceof Error ? e.message : 'Ocorreu um erro inesperado',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Clonar o children e modificar suas props para abrir o diálogo
    const clonedButton = React.cloneElement(children as React.ReactElement<any>, {
        onClick: () => setOpen(true),
    });

    return (
        <>
            {/* Renderizar apenas o botão clonado, sem DialogTrigger */}
            {clonedButton}

            {/* Dialog separado do trigger para evitar problemas */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[90vh] sm:max-w-[650px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{briefing.title}</DialogTitle>
                        <DialogDescription>
                            Edite o conteúdo do briefing para seu vídeo.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[60vh] overflow-y-auto py-4">
                        <Textarea
                            className="min-h-[300px] resize-none font-mono text-sm focus-visible:ring-primary"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Conteúdo do briefing..."
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSaving}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSaving || !text.trim()}
                            className="gap-2"
                        >
                            {isSaving ? (
                                'Salvando...'
                            ) : (
                                <>
                                    <FiEdit2 />
                                    Salvar Alterações
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
