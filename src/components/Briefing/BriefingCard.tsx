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
import TextFallBack from './TextFallBack';

// Icons
import { CiCircleCheck, CiRedo } from 'react-icons/ci';
import { BiDotsHorizontalRounded } from 'react-icons/bi';

import EditBriefingDialog from './EditBriefingDialog';
import MarkdownText from './MarkdownText';
import { useBriefing } from '@/hooks/use-briefing';
import BriefingApprovalDialog from './BriefingApprovalDialog';
import { Status } from '@/types/status';

import SourcesDialog from './SourcesDialog';
import { useToast } from '@/hooks/use-toast';
import RedoBriefingDialog from './RedoBriefingDialog';

interface BriefingCardProps {
    briefing: IBriefing;
}

export default function BriefingCard({ briefing }: BriefingCardProps) {
    const { deleteBriefing, redoBriefing } = useBriefing();
    const { toast } = useToast();

    const handleArchive = async () => {
        deleteBriefing(briefing.id).then(() => {
            toast({
                title: 'Seu briefing foi arquivado com sucesso!',
            });
        });
    };

    return (
        <div className="grid h-full grid-cols-1 grid-rows-[96px_1fr_48px] rounded-xl bg-white p-4 pt-6 lg:me-4">
            <div className="flex w-full items-start justify-between">
                <div className="flex h-full max-w-[80%] flex-col items-start justify-start">
                    <h1 className="text-medium line-clamp-2 text-lg font-bold">{briefing.title}</h1>
                    <time className="mt-2 text-sm text-neutral-500">
                        Data:{' '}
                        <strong className="text-neutral-600">
                            {new Date(briefing.date).toLocaleDateString('pt-br')}
                        </strong>
                    </time>
                </div>
                <div className="flex items-center gap-x-2">
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

                    {briefing.sources && (
                        <SourcesDialog sources={briefing.sources} title={briefing.title} />
                    )}
                </div>
            </div>

            {briefing.status === Status.EM_PRODUCAO ? (
                <TextFallBack />
            ) : (
                <MarkdownText text={briefing.text} />
            )}

            <div className="mt-4 flex w-full items-center justify-between gap-x-2">
                <BriefingApprovalDialog briefing={briefing} className="basis-1/3">
                    <div className="flex min-w-32 items-center justify-center gap-x-1 rounded-lg bg-secondary py-2 text-white transition duration-300 hover:shadow-md">
                        <CiCircleCheck className="text-xl" />
                        Aprovar
                    </div>
                </BriefingApprovalDialog>
                <RedoBriefingDialog briefing={briefing} />
                <EditBriefingDialog briefing={briefing} className="basis-1/3">
                    <div className="ms-auto flex min-w-32 items-center justify-center gap-x-1 rounded-lg bg-secondary py-2 text-white transition duration-300 hover:shadow-md">
                        <CiCircleCheck className="text-xl" />
                        Editar
                    </div>
                </EditBriefingDialog>
            </div>
        </div>
    );
}
