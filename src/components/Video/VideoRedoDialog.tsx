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
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-border text-foreground/70 hover:border-primary/30 hover:text-foreground"
                >
                    <CiRedo className="text-xl" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] overflow-hidden !rounded p-6 sm:px-8 xl:max-w-7xl border-border bg-card text-foreground">
                <DialogHeader>
                    <DialogTitle className="my-4 text-center text-xl text-foreground">{video.title}</DialogTitle>
                    
                    {/* Move FormSteps outside of DialogDescription */}
                    <div className="my-8">
                        <FormSteps step={step} />
                    </div>
                </DialogHeader>
                <>
                    {step == 1 && (
                        <>
                            <div className="mb-4 text-center">
                                <p className="text-muted-foreground">Editar conteúdo do vídeo</p>
                            </div>
                            <textarea
                                rows={15}
                                value={transcription}
                                onChange={(e) => setTranscription(e.target.value)}
                                className="min-h-32 w-full rounded-lg border border-border bg-muted/10 p-4 text-foreground focus-visible:ring-primary"
                            />
                        </>
                    )}

                    {step == 2 && <AvatarList />}
                </>

                <DialogFooter className="mt-6">
                    {step == 1 && (
                        <Button
                            className="mx-auto w-72 bg-gradient-to-r from-[#0085A3] to-primary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                            type="submit"
                            onClick={() => setStep(2)}
                            disabled={transcription.length < 10}
                        >
                            <span className="text-white">Escolha o Avatar</span>
                        </Button>
                    )}
                    {step == 2 && (
                        <div className="mx-auto flex w-full max-w-2xl items-center justify-center gap-x-4">
                            <Button
                                variant="outline"
                                className="w-48 border-border text-foreground hover:border-primary/30 hover:text-foreground"
                                type="submit"
                                onClick={() => setStep(1)}
                                disabled={loading}
                            >
                                <span>Voltar</span>
                            </Button>

                            <Button
                                className="w-72 bg-gradient-to-r from-[#0085A3] to-primary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 data-[loading=true]:animate-pulse"
                                type="submit"
                                onClick={handleRedo}
                                disabled={!selectedAvatar || loading}
                                data-loading={loading}
                            >
                                <span className="text-white">
                                    {loading
                                        ? 'Carregando...'
                                        : selectedAvatar
                                          ? 'Enviar'
                                          : 'Selecione um Avatar'}
                                </span>
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}