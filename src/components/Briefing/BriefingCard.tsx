// Types
import { IBriefing } from '@/types/briefing';

// Components
import AvatarList from './Avatar/AvatarList';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Icons
import { CiCircleCheck } from 'react-icons/ci';
import { BiDotsHorizontalRounded } from 'react-icons/bi';

import EditBriefingDialog from './EditBriefingDialog';
import MarkdownText from './MarkdownText';

interface BriefingCardProps {
    briefing: IBriefing;
}

export default function BriefingCard({ briefing }: BriefingCardProps) {
    return (
        <div className="max-w-full items-center space-y-4 rounded-xl bg-white p-4 pt-6">
            <div className="relative">
                <h4 className="text-center font-bold text-neutral-600">Selecione seu Avatar</h4>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className="absolute right-0 top-0 cursor-pointer rounded-lg bg-neutral-200 p-1 transition-all duration-300 hover:scale-105">
                            <BiDotsHorizontalRounded className="text-lg text-neutral-500" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-neutral-700">
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-neutral-700">
                            Aprovar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <AvatarList />

            <hr></hr>
            <div className="grid grid-cols-1 grid-rows-[32px_32px_260px_48px]">
                <h1 className="text-medium text-lg">{briefing.title}</h1>
                <time className="text-sm text-neutral-500">
                    Data:{' '}
                    <strong className="text-neutral-600">
                        {new Date(briefing.date).toLocaleDateString()}
                    </strong>
                </time>

                <MarkdownText text={briefing.text} />

                <div className="flex items-center justify-between">
                    <button className="flex w-40 items-center justify-center gap-x-1 rounded-lg bg-secondary py-1 text-white transition duration-300 hover:shadow-md">
                        <CiCircleCheck className="text-xl" />
                        Aprovar
                    </button>
                    <EditBriefingDialog briefing={briefing}>
                        <div className="flex w-40 items-center justify-center gap-x-1 rounded-lg bg-secondary py-1 text-white transition duration-300 hover:shadow-md">
                            <CiCircleCheck className="text-xl" />
                            Editar
                        </div>
                    </EditBriefingDialog>
                </div>
            </div>
        </div>
    );
}
