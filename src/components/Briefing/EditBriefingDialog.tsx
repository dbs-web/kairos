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
import { IBriefing } from '@/types/briefing';
import { useBriefing } from '@/hooks/use-briefing';

interface EditBriefingDialogProps {
    briefing: IBriefing;
    children: React.ReactNode;
}

export default function EditBriefingDialog({ children, briefing }: EditBriefingDialogProps) {
    const [text, setText] = useState(briefing.text);
    const [isSaving, setIsSaving] = useState(false);
    const { updateBriefing } = useBriefing();
    const [open, setOpen] = useState<boolean>();

    const handleSubmit = async () => {
        try {
            await updateBriefing(briefing._id, text);
            setOpen(false);
        } catch (e) {
            if (e instanceof Error) console.error(e.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogTrigger>{children}</DialogTrigger>
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
