import React, { useState, ReactNode } from 'react';
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
import { CgTranscript } from 'react-icons/cg';
import { IoCopy } from 'react-icons/io5';

interface TranscriptionDialogProps {
    video: IVideo;
    children?: ReactNode;
}

export default function TranscriptionDialog({ video, children }: TranscriptionDialogProps) {
    const [open, setOpen] = useState<boolean>(false);

    const handleCopyText = () => {
        if (video.transcription) {
            navigator.clipboard.writeText(video.transcription);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <span className="inline-block">
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 border-border text-foreground/70 hover:border-primary/30 hover:text-foreground"
                                >
                                    <CgTranscript className="text-lg" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                side="top"
                                align="center"
                                className="border-border bg-card text-foreground shadow-lg"
                            >
                                <p className="font-medium text-primary">Ver transcrição do vídeo</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </span>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] border-border bg-card text-foreground sm:max-w-[425px] lg:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle className="text-xl text-foreground">{video.title}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Aqui você pode ler a transcrição do seu vídeo
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto py-4">
                    <textarea
                        rows={15}
                        value={video.transcription || ''}
                        className="w-full rounded-lg border border-border bg-muted/10 p-2 text-foreground focus-visible:ring-primary"
                        readOnly
                    />
                </div>

                <DialogFooter className="flex flex-row items-center justify-between">
                    <TooltipProvider delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleCopyText}
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 border-border text-foreground/70 hover:border-primary/30 hover:text-foreground"
                                >
                                    <IoCopy className="text-lg" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                side="top"
                                className="border-border bg-card text-foreground shadow-lg"
                            >
                                <p className="font-medium text-primary">Copiar texto</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Button
                        onClick={() => setOpen(false)}
                        className="bg-gradient-to-r from-[#0085A3] to-primary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                    >
                        <span className="text-white">Fechar</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
