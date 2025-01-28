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
import { useToast } from '@/hooks/use-toast';

interface EditBriefingDialogProps {
    briefing: IBriefing;
    children: React.ReactNode;
}

export default function BriefingApprovalDialog({ children, briefing }: EditBriefingDialogProps) {
    const { sendVideoToProduction } = useBriefing();
    const [open, setOpen] = useState<boolean>();
    const { clearSelectedAvatar, selectedAvatar } = useBriefing();
    const { toast } = useToast();

    const handleSubmit = async () => {
        try {
            sendVideoToProduction(briefing.id);
            toast({
                title: 'Seu vídeo foi enviado para a produção!',
                description: "Em alguns instantes você receberá ele na aba 'Finalizados'",
            });
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
            <DialogContent className="max-w-[90vw] !rounded">
                <div className="relative flex max-w-[90%] flex-col items-center">
                    <DialogHeader>
                        <DialogTitle>{briefing.title}</DialogTitle>
                        <DialogDescription>
                            Selecione seu avatar antes de criar o vídeo.
                        </DialogDescription>
                    </DialogHeader>
                    <AvatarList />
                    <button
                        onClick={handleSubmit}
                        className="mt-4 rounded-lg bg-primary p-2 px-4 text-xs text-white disabled:bg-neutral-400"
                        disabled={!selectedAvatar}
                    >
                        {!selectedAvatar
                            ? 'Selecione o avatar antes de criar o vídeo'
                            : 'Criar vídeo'}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
