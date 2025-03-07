'use client';
import { useState } from 'react';

// UI
import LoadingSubmission from './LoadingSubmission';
import AvatarSelectionDialog from '@/components/AvatarSelection/AvatarSelectionDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function CreateWithoutAIForm() {
    const [title, setTitle] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    if (isSubmitting) {
        return <LoadingSubmission />;
    }

    return (
        <form className="mt-6 flex flex-col gap-y-5">
            <div>
                <label className="text-sm font-medium text-neutral-700">Título</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Título do seu vídeo"
                    className="mt-1.5 flex h-9 w-full rounded-md border border-input border-neutral-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                />
            </div>

            <div>
                <label className="text-sm font-medium text-neutral-700">Instruções</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="mt-1.5 flex h-9 min-h-40 w-full resize-none rounded-md border border-input border-neutral-200 bg-transparent px-3 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="Sobre o que deseja que o vídeo aborde?"
                    required
                />
            </div>
            {title.length > 5 && text.length > 10 ? (
                <AvatarSelectionDialog
                    className="rounded-lg bg-primary p-2 text-white"
                    payload={{ title, text }}
                >
                    Selecionar Avatar
                </AvatarSelectionDialog>
            ) : (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="w-full" asChild>
                            <button
                                className="w-full cursor-not-allowed rounded-lg bg-neutral-600 p-2 text-white"
                                disabled
                            >
                                Selecionar Avatar
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="border-2 bg-white text-sm text-neutral-900 shadow-xl">
                            <p>
                                Adicione um título válido e um texto de pelo menos 10 caracteres
                                para produzir seu vídeo.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </form>
    );
}
