'use client';
import { CiCirclePlus } from 'react-icons/ci';

export default function CreateSuggestionButton() {
    const handleCreateSuggestion = () => {
        fetch('/api/sugestoes/generate', {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };

    return (
        <button
            onClick={handleCreateSuggestion}
            className="flex cursor-pointer items-center justify-start gap-x-2 self-start rounded-md bg-white p-2 font-medium text-primary shadow-md transition-all duration-300 hover:bg-primary hover:text-white"
        >
            <CiCirclePlus />
            <span className="">Criar conteúdos</span>
        </button>
    );
}
