'use client';
import { useState } from 'react';
import LoadingSubmission from './LoadingSubmission';
import AvatarSelectionDialog from '@/components/AvatarSelection/AvatarSelectionDialog';

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
                    className="mt-1.5 flex h-9 w-full rounded-md border border-input border-neutral-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary/20"
                    required
                />
            </div>

            <div>
                <label className="text-sm font-medium text-neutral-700">Instruções</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="mt-1.5 flex min-h-40 w-full resize-none rounded-md border border-input border-neutral-200 bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-neutral-400 focus:border-primary focus:ring-1 focus:ring-primary/20"
                    placeholder="Sobre o que deseja que o vídeo aborde?"
                    required
                />
            </div>

            <AvatarSelectionDialog
                className="rounded-lg bg-primary p-2 text-white"
                payload={{ title, text }}
            >
                Selecionar Avatar
            </AvatarSelectionDialog>
        </form>
    );
}
