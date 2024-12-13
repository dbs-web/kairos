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
import AvatarList from './Avatar/AvatarList';

interface EditBriefingDialogProps {
    briefing: IBriefing;
    children: React.ReactNode;
}

export default function BriefingApprovalDialog({ children, briefing }: EditBriefingDialogProps) {
    const { sendVideoToProduction } = useBriefing();
    const [open, setOpen] = useState<boolean>();
    const { clearSelectedAvatar, selectedAvatar } = useBriefing();

    const handleSubmit = async () => {
        try {
            sendVideoToProduction(briefing._id);
            setOpen(false);
        } catch (e) {
            if (e instanceof Error) console.error(e.message);
        }
    };

    const handleDialogClose = () => {
        clearSelectedAvatar();
        setOpen(!open);
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{briefing.title}</DialogTitle>
                    <DialogDescription>
                        Selecione seu avatar antes de criar o vídeo.
                    </DialogDescription>
                </DialogHeader>
                <AvatarList />
                <button
                    onClick={handleSubmit}
                    className="mt-4 w-full rounded-lg bg-primary p-2 text-white disabled:bg-neutral-400"
                    disabled={!selectedAvatar}
                >
                    {!selectedAvatar ? 'Selecione o avatar antes de criar o vídeo' : 'Criar vídeo'}
                </button>
            </DialogContent>
        </Dialog>
    );
}
