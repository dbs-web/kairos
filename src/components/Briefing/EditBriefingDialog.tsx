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
    const [text, setText] = useState<string>(briefing.text ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const { updateBriefing } = useBriefing();
    const [open, setOpen] = useState<boolean>();
    const { toast } = useToast();

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            await updateBriefing(briefing.id, text, briefing.status);
            toast({
                title: 'Seu briefing foi editado com sucesso!',
            });
            setIsSaving(false);
            setOpen(false);
        } catch (e) {
            if (e instanceof Error) console.error(e.message);
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
                    disabled={isSaving}
                >
                    {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
            </DialogContent>
        </Dialog>
    );
}
