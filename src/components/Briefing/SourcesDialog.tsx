import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import MarkdownText from './MarkdownText';
import { MdArticle } from 'react-icons/md';

interface SourcesDialogProps {
    title: string;
    sources: string;
}

export default function SourcesDialog({ title, sources }: SourcesDialogProps) {
    const [open, setOpen] = useState<boolean>(false);
    const handleDialogClose = () => {
        setOpen(!open);
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogTrigger className="">
                <div className="group flex cursor-pointer items-center gap-x-1.5 text-xs font-medium text-neutral-700 transition-colors hover:text-primary">
                    <MdArticle className="text-sm transition-colors group-hover:text-primary" />
                    Ver Fonte
                </div>
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
