import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';

import MarkdownText from './MarkdownText';
import { Button } from '../ui/button';
import { MdOpenInNew } from 'react-icons/md';

interface SourcesDialogProps {
    title: string;
    sources: string;
    children: React.ReactNode;
}

export default function SourcesDialog({ title, sources, children }: SourcesDialogProps) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <span className="inline-block">{children}</span>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] border-border bg-card text-foreground sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl text-foreground">
                        <MdOpenInNew className="text-primary" />
                        Fontes: {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="max-h-[60vh] py-4">
                    <MarkdownText text={sources} className="w-full" />
                </div>

                <DialogFooter>
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
