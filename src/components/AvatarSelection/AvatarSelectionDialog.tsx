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
    const { sendVideo, clearSelectedAvatar, selectedAvatar, error } = useVideoCreation();
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
                description: error,
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
            <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-hidden !rounded border-border bg-card p-6 xl:max-w-7xl">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-foreground text-xl">Selecione o Avatar</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[60vh]">
                    <AvatarList />
                </div>
                <div className="pt-4 border-t border-border">
                    <button
                        onClick={handleSubmit}
                        className="create-video-button w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#0085A3] to-primary p-3 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!selectedAvatar || loading}
                    >
                        <span className="text-white">{loading ? 'Enviando...' : 'Enviar Vídeo'}</span>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
