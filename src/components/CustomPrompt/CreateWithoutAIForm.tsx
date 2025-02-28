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
                <label className="text-sm font-medium text-foreground">Título</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Título do seu vídeo"
                    className="mt-1.5 flex h-9 w-full rounded-md border border-border bg-card px-3 py-1 text-base text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                />
            </div>

            <div>
                <label className="text-sm font-medium text-foreground">Instruções</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="mt-1.5 flex h-9 min-h-40 w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-base text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="Sobre o que deseja que o vídeo aborde?"
                    required
                />
            </div>
            {title.length > 5 && text.length > 10 ? (
                <AvatarSelectionDialog
                    className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[hsl(191,65%,53%)] to-[#0085A3] p-2 text-white"
                    payload={{ title, text }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>Selecionar Avatar</span>
                </AvatarSelectionDialog>
            ) : (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="w-full" asChild>
                            <button
                                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-muted p-2 text-muted-foreground"
                                disabled
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>Selecionar Avatar</span>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="border-2 border-border bg-card text-sm text-foreground shadow-xl">
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
