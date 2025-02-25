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
import { CiCircleCheck, CiRedo } from 'react-icons/ci';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FiEdit2 } from 'react-icons/fi';

export default function BriefingCardSkelleton() {
    return (
        <div className="grid grid-cols-1 grid-rows-[96px_1fr_48px] rounded-xl bg-white p-4 pt-6 lg:me-4">
            <div className="flex w-full items-start justify-between">
                <div className="flex h-full max-w-[80%] flex-col items-start justify-start">
                    <div className="h-4 w-48 animate-pulse rounded bg-neutral-300"></div>
                    <div className="mt-2 h-3 w-32 animate-pulse rounded bg-neutral-300"></div>
                </div>
                <div className="flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger disabled>
                            <div className="cursor-pointer rounded-lg bg-neutral-200 p-1 transition-all duration-300 hover:scale-105">
                                <BiDotsHorizontalRounded className="text-lg text-neutral-500" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-neutral-700">
                                Arquivar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <TextFallBack />

            <div className="mt-4 flex w-full items-center justify-between gap-x-2">
                <div className="flex basis-1/3 items-center justify-center gap-x-1 rounded-lg bg-secondary py-2 text-white transition duration-300 hover:shadow-md">
                    <CiCircleCheck className="text-xl" />
                    <div className="h-3 w-12 animate-pulse rounded bg-neutral-300/40 xl:w-16"></div>
                </div>
                <div className="flex basis-1/3 cursor-pointer items-center justify-center gap-x-1 rounded-lg bg-secondary py-2 text-white transition duration-300 hover:shadow-md">
                    <CiRedo className="text-lg xl:text-xl" />
                    <div className="h-3 w-12 animate-pulse rounded bg-neutral-300/40 xl:w-16"></div>
                </div>
                <div className="ms-auto flex basis-1/3 items-center justify-center gap-x-1 rounded-lg bg-secondary py-2 text-white transition duration-300 hover:shadow-md">
                    <FiEdit2 />
                    <div className="h-3 w-12 animate-pulse rounded bg-neutral-300/40 xl:w-16"></div>
                </div>
            </div>
        </div>
    );
}
