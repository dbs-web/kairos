'use client';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { IBriefing } from '@/domain/entities/briefing';
import { useBriefing } from '@/hooks/use-briefing';
import { useToast } from '@/hooks/use-toast';
import { SecurityPolicyViolantionError } from '@/shared/errors';

interface EditBriefingDialogProps {
    briefing: IBriefing;
    className?: string;
    children: React.ReactNode;
}

export default function EditBriefingDialog({
    children,
    briefing,
    className,
}: EditBriefingDialogProps) {
    const [text, setText] = useState<string>(briefing.text ?? '');
    const { updateBriefing, refetch } = useBriefing();
    const [open, setOpen] = useState<boolean>();
    const { toast } = useToast();

    const handleSubmit = async () => {
        setOpen(false);
        toast({title : "Aguarde...", description: "Nós estamos verificando se o seu texto segue as nossas diretrizes de uso."})
        
        try {
            await updateBriefing(briefing.id, text, briefing.status);
            toast({
                title: 'Seu briefing foi editado com sucesso!',
            });
        } catch (e) {
            toast({
                title : "Seu texto foi rejeitado.",
                description: "Verifique se ele segue as normas e políticas de uso do nosso app."
            })
        }
    };

    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogTrigger className={className}>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{briefing.title}</DialogTitle>
                    <DialogDescription>
                        Aqui você pode editar o briefing para seu vídeo.
                    </DialogDescription>
                </DialogHeader>
                <textarea
                    rows={15}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="rounded-lg border bg-transparent p-2"
                />
                <button
                    onClick={handleSubmit}
                    className="mt-4 w-full rounded-lg bg-primary p-2 text-white"

                >
                    {'Salvar'}
                </button>
            </DialogContent>
        </Dialog>
    );
}