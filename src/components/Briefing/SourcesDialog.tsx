import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import MarkdownText from './MarkdownText';

interface SourcesDialogProps {
    title: string;
    sources: string;
}

export default function SourcesDialog({ title, sources }: SourcesDialogProps) {
    const [open, setOpen] = useState<boolean>();
    const handleDialogClose = () => {
        setOpen(!open);
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogTrigger className="rounded-lg bg-neutral-200 px-2 py-0.5 text-neutral-500">
                Ver Fonte
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] !rounded xl:w-[700px]">
                <div className="relative flex flex-col items-center gap-y-8">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <MarkdownText text={sources} className="w-full" />
                </div>
            </DialogContent>
        </Dialog>
    );
}
