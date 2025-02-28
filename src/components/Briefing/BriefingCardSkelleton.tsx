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

export default function BriefingCardSkeleton() {
    return (
        <div className="relative flex h-full flex-col rounded-xl bg-card shadow-md transition-all duration-300">
            {/* Card border */}
            <div className="absolute inset-0 rounded-xl border border-border transition-all duration-100" />

            {/* Cabeçalho do card */}
            <div className="flex items-start justify-between border-b border-border p-5">
                <div className="flex max-w-[80%] flex-col">
                    <Skeleton className="mb-2 h-6 w-3/4 rounded-md bg-muted" />
                    <div className="mt-2 flex items-center gap-x-3">
                        <Skeleton className="h-4 w-40 rounded-md bg-muted" />
                        <Skeleton className="h-4 w-24 rounded-md bg-muted" />
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 cursor-default border-border opacity-50"
                    disabled
                >
                    <BiDotsHorizontalRounded className="text-lg text-muted-foreground" />
                </Button>
            </div>

            {/* Conteúdo do briefing */}
            <div className="flex-grow px-5 py-4">
                <TextFallBack />
            </div>

            {/* Botões de ação */}
            <div className="grid grid-cols-3 gap-3 border-t border-border p-5">
                <Skeleton className="h-10 w-full rounded-md bg-muted" />
                <Skeleton className="h-10 w-full rounded-md bg-muted" />
                <Skeleton className="h-10 w-full rounded-md bg-primary/20" />
            </div>
        </div>
    );
}
