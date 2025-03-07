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

    // Clonar o children e modificar suas props para abrir o diálogo
    const clonedTrigger = React.cloneElement(
        children as React.ReactElement<{ onClick?: () => void }>,
        {
            onClick: () => setOpen(true),
        },
    );

    return (
        <>
            {/* Renderizar apenas o trigger clonado, sem DialogTrigger */}
            {clonedTrigger}

            {/* Dialog separado do trigger para evitar problemas */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[90vh] sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <MdOpenInNew className="text-primary" />
                            Fontes: {title}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="max-h-[60vh] py-4">
                        <MarkdownText text={sources} className="w-full" />
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setOpen(false)}>Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
