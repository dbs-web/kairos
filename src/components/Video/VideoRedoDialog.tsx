import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IVideo } from '@/domain/entities/video';
import { Button } from '../ui/button';

import { useState } from 'react';
import { CiRedo } from 'react-icons/ci';
import AvatarList from '../AvatarSelection/Avatar/AvatarList';
import { useVideoCreation } from '@/hooks/use-video-creation';
import { useToast } from '@/hooks/use-toast';
import FormSteps from './FormSteps';

interface VideoRedoDialogProps {
    video: IVideo;
}

export default function VideoRedoDialog({ video }: VideoRedoDialogProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [transcription, setTranscription] = useState<string>(video.transcription as string);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { selectedAvatar, clearSelectedAvatar, sendVideo, error } = useVideoCreation();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleRedo = async () => {
        setLoading(true);
        const success = await sendVideo({ videoId: video.id, transcription });
        setLoading(false);
        if (success) {
            toast({
                title: 'Vídeo enviado com sucesso!',
                description: 'Você receberá o vídeo em breve.',
            });
            clearSelectedAvatar();
            setIsOpen(false);
        } else {
            toast({
                title: 'Erro ao enviar vídeo',
                description: 'Tente novamente mais tarde.',
            });
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 border-border text-foreground/70 hover:border-primary/30 hover:text-foreground"
                                >
                                    <CiRedo className="text-xl" />
                                </Button>
                        </TooltipTrigger>
                        <TooltipContent className="border-border bg-card text-foreground shadow-lg">
                            <p className="font-medium text-primary">Ver transcrição do vídeo</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] overflow-hidden !rounded p-2 sm:px-4 xl:max-w-7xl">
                <DialogHeader>
                    <DialogTitle className="my-4 text-center">{video.title}</DialogTitle>
                    <DialogDescription className="my-8">
                        <FormSteps step={step} />
                    </DialogDescription>
                </DialogHeader>
                <>
                    {step == 1 && (
                        <textarea
                            rows={15}
                            value={transcription}
                            onChange={(e) => setTranscription(e.target.value)}
                            className="min-h-32 rounded-lg border bg-transparent p-2"
                        />
                    )}

                    {step == 2 && <AvatarList />}
                </>

                <DialogFooter>
                    {step == 1 && (
                        <Button
                            className="mx-auto w-72"
                            type="submit"
                            onClick={() => setStep(2)}
                            disabled={transcription.length < 10}
                        >
                            Escolha o Avatar
                        </Button>
                    )}
                    {step == 2 && (
                        <div className="mx-auto flex w-1/2 min-w-[400px] items-center justify-center gap-x-4">
                            <Button
                                className="w-48 bg-secondary"
                                type="submit"
                                onClick={() => setStep(1)}
                                disabled={loading}
                            >
                                Voltar
                            </Button>

                            <Button
                                className="w-72 data-[loading=true]:animate-pulse"
                                type="submit"
                                onClick={handleRedo}
                                disabled={!selectedAvatar || loading}
                                data-loading={loading}
                            >
                                {loading
                                    ? 'Carregando...'
                                    : selectedAvatar
                                      ? 'Enviar'
                                      : 'Selecione um Avatar'}
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
