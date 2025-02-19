import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { Source } from '@/domain/entities/briefing';
import MarkdownText from './MarkdownText';

interface SourcesDialogProps {
    title: string;
    sources: Source;
}

export default function SourcesDialog({ title, sources }: SourcesDialogProps) {
    const [open, setOpen] = useState<boolean>();
    const [markDownText, setMarkdownText] = useState<string>('');
    const handleDialogClose = () => {
        setOpen(!open);
    };

    const handleMarkdownText = () => {
        if (sources?.citations?.length > 0) {
            const urls = sources.citations.map(
                (citation) => `[${citation.title}](${citation.url})\n`,
            );

            let text = sources.content;

            text += '\n\n## Fontes:\n\n';

            urls.forEach((url) => (text += url + '\n'));

            setMarkdownText(text);
        }
    };

    useEffect(() => {
        handleMarkdownText();
    }, []);

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
                    <MarkdownText text={markDownText} className="w-full" />
                </div>
            </DialogContent>
        </Dialog>
    );
}
