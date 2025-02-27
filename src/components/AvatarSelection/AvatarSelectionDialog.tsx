'use client';
import { ReactNode, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AvatarList from './Avatar/AvatarList';
import { useVideoCreation } from '@/hooks/use-video-creation';
import { useToast } from '@/hooks/use-toast';

interface AvatarSelectionDialogProps {
    className?: string;
    children: ReactNode;
    payload:
        | {
              title: string;
              text: string;
          }
        | {
              briefingId: number;
          };
}

export default function AvatarSelectionDialog({
    className,
    payload,
    children,
}: AvatarSelectionDialogProps) {
    const { sendVideo, clearSelectedAvatar, selectedAvatar } = useVideoCreation();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!selectedAvatar) {
            toast({ title: 'Selecione um avatar!' });
            return;
        }
        setLoading(true);
        const success = await sendVideo(payload);
        setLoading(false);
        if (success) {
            toast({
                title: 'Vídeo enviado com sucesso!',
                description: 'Você receberá o vídeo em breve.',
            });
            clearSelectedAvatar();
            setOpen(false);
        } else {
            toast({
                title: 'Erro ao enviar vídeo',
                description: 'Tente novamente mais tarde.',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <span role="button" tabIndex={0} className={className}>
                    {children}
                </span>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] overflow-hidden !rounded p-2 sm:px-4 xl:max-w-7xl bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Selecione o Avatar</DialogTitle>
                </DialogHeader>
                <AvatarList />
                <button
                    onClick={handleSubmit}
                    className="create-video-button mt-4 rounded-lg p-2 text-xs text-white w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedAvatar || loading}
                >
                    {loading ? 'Enviando...' : 'Enviar Vídeo'}
                </button>
            </DialogContent>
        </Dialog>
    );
}