import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '../ui/button';
import { MdSubtitles } from 'react-icons/md';
import { IoCopy } from 'react-icons/io5';
import { IVideo } from '@/domain/entities/video';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LegendaDialogProps {
    video: IVideo;
}

export default function LegendaDialog({ video }: LegendaDialogProps) {
    const [open, setOpen] = useState<boolean>(false);

    const handleCopyText = () => {
        if (video.legenda) {
            navigator.clipboard.writeText(video.legenda);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <span className="inline-block">
                    <TooltipProvider delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 border-border text-foreground/70 hover:border-primary/30 hover:text-foreground"
                                >
                                    <MdSubtitles className="text-lg" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                side="top"
                                align="center"
                                className="border-border bg-card text-foreground shadow-lg"
                            >
                                <p className="font-medium text-primary">Ver legenda do vídeo</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </span>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] border-border bg-card text-foreground sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle className="text-xl text-foreground">{video.title}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Aqui você pode ler a legenda do seu vídeo
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[60vh] py-4">
                    <div className="rounded-lg border border-border bg-muted/10 p-2">
                        <ScrollArea className="max-h-[60vh]">
                            <div className="pr-4">
                                <p className="whitespace-pre-line p-2 text-sm text-foreground/90">
                                    {video.legenda || 'Nenhuma legenda disponível para este vídeo.'}
                                </p>
                            </div>
                        </ScrollArea>
                    </div>
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
                        className="bg-gradient-to-r from-[#0085A3] to-primary text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                    >
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
