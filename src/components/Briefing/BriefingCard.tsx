// Types
import { IBriefing } from '@/domain/entities/briefing';

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
import { CiCircleCheck } from 'react-icons/ci';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FiEdit2 } from 'react-icons/fi';

import EditBriefingDialog from './EditBriefingDialog';
import MarkdownText from './MarkdownText';
import { useBriefing } from '@/hooks/use-briefing';
import { Status } from '@/domain/entities/status';

import SourcesDialog from './SourcesDialog';
import { useToast } from '@/hooks/use-toast';
import RedoBriefingDialog from './RedoBriefingDialog';
import AvatarSelectionDialog from '../AvatarSelection/AvatarSelectionDialog';
import { VideoCreationProvider } from '@/hooks/use-video-creation';
import { createVideoBriefing } from '@/services/client/video/createVideoBriefing';

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
                            {briefing.date && new Date(briefing.date).toLocaleDateString('pt-br')}
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
                // @ts-expect-error Briefing will always have text field
                <MarkdownText text={briefing.text} />
            )}

            <div className="mt-4 flex w-full items-center justify-between gap-x-2">
                <VideoCreationProvider createVideo={createVideoBriefing}>
                    <AvatarSelectionDialog
                        className="basis-1/3"
                        payload={{ briefingId: briefing.id }}
                    >
                        <div className="ms-auto flex items-center justify-center gap-x-1 rounded-lg bg-secondary py-2 text-xs text-white transition duration-300 hover:shadow-md xl:text-base">
                            <CiCircleCheck className="text-xl" />
                            Aprovar
                        </div>
                    </AvatarSelectionDialog>
                </VideoCreationProvider>

                <RedoBriefingDialog briefing={briefing} />

                <EditBriefingDialog briefing={briefing} className="basis-1/3">
                    <div className="flex items-center justify-center gap-x-1 rounded-lg bg-secondary py-2 text-xs text-white transition duration-300 hover:shadow-md xl:text-base">
                        <FiEdit2 />
                        Editar
                    </div>
                </EditBriefingDialog>
            </div>
        </div>
    );
}
