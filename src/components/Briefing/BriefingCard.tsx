// Types
import { IBriefing } from '@/types/briefing';

// Components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Icons
import { CiCircleCheck, CiRedo } from 'react-icons/ci';
import { BiDotsHorizontalRounded } from 'react-icons/bi';

import EditBriefingDialog from './EditBriefingDialog';
import MarkdownText from './MarkdownText';
import { useBriefing } from '@/hooks/use-briefing';
import BriefingApprovalDialog from './BriefingApprovalDialog';
import { Status } from '@/types/status';
import StatusBadge from '../ui/status-badge';

interface BriefingCardProps {
    briefing: IBriefing;
}

export default function BriefingCard({ briefing }: BriefingCardProps) {
    const { deleteBriefing, redoBriefing } = useBriefing();

    const handleArchive = () => {
        deleteBriefing(briefing.id);
    };

    const handleRedoBriefing = () => {
        redoBriefing(briefing.id);
    };

    return (
        <div className="items-center space-y-4 rounded-xl bg-white p-4 pt-6 lg:me-4">
            <div className="flex w-full items-start justify-between">
                <div className="flex h-full max-w-[80%] flex-col items-start justify-between">
                    <span>{briefing.id}</span>
                    <h1 className="text-medium line-clamp-2 text-lg font-bold">{briefing.title}</h1>
                    <time className="text-sm text-neutral-500">
                        Data:{' '}
                        <strong className="text-neutral-600">
                            {new Date(briefing.date).toLocaleDateString('pt-br')}
                        </strong>
                    </time>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className="cursor-pointer rounded-lg bg-neutral-200 p-1 transition-all duration-300 hover:scale-105">
                            <BiDotsHorizontalRounded className="text-lg text-neutral-500" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer text-neutral-700"
                            onClick={handleArchive}
                        >
                            Arquivar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {briefing.status === Status.EM_PRODUCAO ? (
                <TextFallBack />
            ) : (
                <MarkdownText text={briefing.text} />
            )}

            <div className="mt-4 flex w-full items-center justify-between gap-x-2">
                <BriefingApprovalDialog briefing={briefing}>
                    <div className="flex min-w-32 basis-1/3 items-center justify-center gap-x-1 rounded-lg bg-secondary py-2 text-white transition duration-300 hover:shadow-md">
                        <CiCircleCheck className="text-xl" />
                        Aprovar
                    </div>
                </BriefingApprovalDialog>
                <div
                    onClick={handleRedoBriefing}
                    className="flex basis-1/3 cursor-pointer items-center justify-center gap-x-1 rounded-lg bg-secondary py-2 text-white transition duration-300 hover:shadow-md"
                >
                    <CiRedo className="text-xl" />
                    Refazer Conteudo
                </div>
                <EditBriefingDialog briefing={briefing}>
                    <div className="ms-auto flex min-w-32 basis-1/3 items-center justify-center gap-x-1 rounded-lg bg-secondary py-2 text-white transition duration-300 hover:shadow-md">
                        <CiCircleCheck className="text-xl" />
                        Editar
                    </div>
                </EditBriefingDialog>
            </div>
        </div>
    );
}

function TextFallBack() {
    return (
        <div className="h-80 animate-pulse space-y-2 rounded-lg border-b border-t bg-muted/80 p-2 pr-4 shadow-sm">
            <div className="h-3 w-[97%] rounded-full bg-neutral-500/50"></div>
            <div className="h-3 w-[92%] rounded-full bg-neutral-500/50"></div>
            <div className="h-3 w-[99%] rounded-full bg-neutral-500/50"></div>
            <div className="h-3 w-[97%] rounded-full bg-neutral-500/50"></div>
            <div className="h-3 w-[98%] rounded-full bg-neutral-500/50"></div>
            <div className="h-3 w-[90%] rounded-full bg-neutral-500/50"></div>
            <div className="h-3 w-[32%] rounded-full bg-neutral-500/50"></div>
        </div>
    );
}
