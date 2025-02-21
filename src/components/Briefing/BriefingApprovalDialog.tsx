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
import AvatarList from './Avatar/AvatarList';
import { useToast } from '@/hooks/use-toast';

interface EditBriefingDialogProps {
    briefing: IBriefing;
    className?: string;
    children: React.ReactNode;
}

export default function BriefingApprovalDialog({
    children,
    briefing,
    className,
}: EditBriefingDialogProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const { sendVideoToProduction } = useBriefing();
    const [open, setOpen] = useState<boolean>();
    const { clearSelectedAvatar, selectedAvatar } = useBriefing();
    const { toast } = useToast();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const success = await sendVideoToProduction(briefing.id);

            if (success) {
                toast({
                    title: 'Seu vídeo foi enviado para a produção!',
                    description: "Em alguns instantes você receberá ele na aba 'Finalizados'",
                });
            } else {
                toast({
                    title: 'Ocorreu um erro ao gerar o seu vídeo!',
                    description:
                        'Tente novamente mais tarde, se o error persistir, entre em contato com o suporte.',
                });
            }
            setLoading(false);
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
            <DialogTrigger className={className}>{children}</DialogTrigger>
            <DialogContent className="max-w-[90vw] !rounded xl:max-w-[600px]">
                <div className="relative flex flex-col items-center">
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
                        {loading
                            ? 'Carregando...'
                            : !selectedAvatar
                              ? 'Selecione o avatar antes de criar o vídeo'
                              : 'Criar vídeo'}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
