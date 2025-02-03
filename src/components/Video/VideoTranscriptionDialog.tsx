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
import { IVideo } from '@/types/video';
import { Button } from '../ui/button';

import { CgTranscript } from 'react-icons/cg';
import { useState } from 'react';

interface TranscriptionDialogProps {
    video: IVideo;
}

export default function TranscriptionDialog({ video }: TranscriptionDialogProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleCloseDialog = () => {
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="absolute right-2 top-2 grid h-8 w-8 items-center justify-center rounded bg-primary transition-all duration-300 hover:scale-105">
                                <CgTranscript className="text-2xl text-white" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white shadow-lg">
                            <p className="font-medium text-primary">Ver transcrição do vídeo</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] lg:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle className="mt-4">{video.title}</DialogTitle>
                    <DialogDescription>
                        Aqui você pode ler a transcrição do seu vídeo
                    </DialogDescription>
                </DialogHeader>
                <textarea
                    rows={15}
                    value={video.transcription}
                    className="rounded-lg border bg-transparent p-2"
                    readOnly
                />
                <DialogFooter>
                    <Button className="mx-auto w-48" type="submit" onClick={handleCloseDialog}>
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
