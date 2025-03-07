// Components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TextFallBack from './TextFallBack';

// Icons
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

export default function BriefingCardSkelleton() {
    return (
        <div className="flex h-full flex-col rounded-xl bg-white shadow-sm">
            {/* Cabeçalho do card */}
            <div className="flex items-start justify-between border-b border-neutral-100 p-5">
                <div className="flex max-w-[80%] flex-col">
                    <Skeleton className="mb-2 h-6 w-3/4 rounded-md" />
                    <div className="mt-2 flex items-center gap-x-3">
                        <Skeleton className="h-4 w-40 rounded-md" />
                        <Skeleton className="h-4 w-24 rounded-md" />
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 cursor-default border-neutral-200 opacity-50"
                    disabled
                >
                    <BiDotsHorizontalRounded className="text-lg text-neutral-400" />
                </Button>
            </div>

            {/* Conteúdo do briefing */}
            <div className="flex-grow px-5 py-4">
                <TextFallBack />
            </div>

            {/* Botões de ação */}
            <div className="grid grid-cols-3 gap-3 border-t border-neutral-100 p-5">
                <Skeleton className="h-10 w-full rounded-md bg-neutral-200" />
                <Skeleton className="h-10 w-full rounded-md bg-neutral-200" />
                <Skeleton className="h-10 w-full rounded-md bg-primary/20" />
            </div>
        </div>
    );
}
