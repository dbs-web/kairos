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
import { CiCircleCheck } from 'react-icons/ci';
import { BiDotsHorizontalRounded } from 'react-icons/bi';

import EditBriefingDialog from './EditBriefingDialog';
import MarkdownText from './MarkdownText';
import { useBriefing } from '@/hooks/use-briefing';
import BriefingApprovalDialog from './BriefingApprovalDialog';
import StatusBadge from '../ui/status-badge';

interface BriefingCardProps {
    briefing: IBriefing;
}
export default function BriefingCard({ briefing }: BriefingCardProps) {
    const { deleteBriefing } = useBriefing();
    const handleArchive = () => {
        deleteBriefing(briefing.id);
    };
    return (
        <div className="me-8 items-center space-y-4 rounded-xl bg-white p-4 pt-6">
            <div className="flex w-full items-start justify-between">
                <div className="flex h-full max-w-[80%] flex-col items-start justify-between">
                    <h1 className="text-medium line-clamp-2 text-lg font-bold">{briefing.title}</h1>
                    <time className="text-sm text-neutral-500">
                        Data:{' '}
                        <strong className="text-neutral-600">
                            {new Date(briefing.date).toLocaleDateString()}
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

            <div className="grid grid-cols-1 grid-rows-[400px_48px]">
                <MarkdownText text={briefing.text} />

                <div className="mt-4 flex items-center justify-between">
                    <BriefingApprovalDialog briefing={briefing}>
                        <div className="flex w-40 items-center justify-center gap-x-1 rounded-lg bg-secondary py-1 text-white transition duration-300 hover:shadow-md">
                            <CiCircleCheck className="text-xl" />
                            Aprovar
                        </div>
                    </BriefingApprovalDialog>

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
