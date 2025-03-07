import { DifyStatus, IBriefing } from '@/domain/entities/briefing';

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
import { MdArticle, MdRefresh } from 'react-icons/md';

import EditBriefingDialog from './EditBriefingDialog';
import MarkdownText from './MarkdownText';
import { useBriefing } from '@/hooks/use-briefing';

import SourcesDialog from './SourcesDialog';
import { useToast } from '@/hooks/use-toast';
import RedoBriefingDialog from './RedoBriefingDialog';
import AvatarSelectionDialog from '../AvatarSelection/AvatarSelectionDialog';
import { VideoCreationProvider } from '@/hooks/use-video-creation';
import { createVideoBriefing } from '@/services/client/video/createVideoBriefing';
import { Button } from '../ui/button';
import { Status } from '@prisma/client';

interface BriefingCardProps {
    briefing: IBriefing;
}

export default function BriefingCard({ briefing }: BriefingCardProps) {
    const { deleteBriefing } = useBriefing();
    const { toast } = useToast();

    const handleArchive = async () => {
        deleteBriefing(briefing.id).then(() => {
            toast({
                title: 'Seu briefing foi arquivado com sucesso!',
            });
        });
    };

    return (
        <div className="flex h-full flex-col rounded-xl bg-white shadow-sm">
            {/* Cabeçalho do card */}
            <div className="flex items-start justify-between border-b border-neutral-100 p-5">
                <div className="flex max-w-[80%] flex-col">
                    <h1 className="line-clamp-2 text-lg font-bold text-neutral-900">
                        {briefing.title}
                    </h1>
                    <div className="mt-2 flex items-center gap-x-3">
                        <time className="text-sm text-neutral-500">
                            Data:{' '}
                            <strong className="text-neutral-700">
                                {briefing.date &&
                                    new Date(briefing.date).toLocaleDateString('pt-br')}
                            </strong>
                        </time>

                        {briefing.sources && (
                            <SourcesDialog sources={briefing.sources} title={briefing.title} />
                        )}
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-800"
                        >
                            <BiDotsHorizontalRounded className="text-lg" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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

            {/* Conteúdo do briefing */}
            <div className="flex-grow px-5 py-4">
                {briefing.difyStatus === DifyStatus.ERROR ? (
                    <MarkdownText
                        text={
                            'Ocorreu um erro ao gerar seu conteúdo, tente gerar ele novamente clicando em refazer. Caso o erro persista, entre em contato com os desenvolvedores.'
                        }
                    />
                ) : briefing.status === Status.EM_PRODUCAO ? (
                    <TextFallBack />
                ) : (
                    <MarkdownText text={briefing.text as string} />
                )}
            </div>

            {/* Botões de ação */}
            <div className="grid grid-cols-3 gap-3 border-t border-neutral-100 p-5">
                <RedoBriefingDialog briefing={briefing}>
                    <Button
                        variant="outline"
                        className="w-full border-neutral-200 text-neutral-800 hover:bg-neutral-50"
                    >
                        <MdRefresh className="mr-2" />
                        Refazer
                    </Button>
                </RedoBriefingDialog>

                <EditBriefingDialog briefing={briefing}>
                    <Button
                        variant="outline"
                        className="w-full border-neutral-200 text-neutral-800 hover:bg-neutral-50"
                    >
                        <FiEdit2 className="mr-2" />
                        Editar
                    </Button>
                </EditBriefingDialog>

                <VideoCreationProvider createVideo={createVideoBriefing}>
                    <AvatarSelectionDialog payload={{ briefingId: briefing.id }}>
                        <Button className="w-full bg-primary text-white shadow-sm hover:bg-primary/90">
                            <CiCircleCheck className="mr-2 text-xl" />
                            Aprovar
                        </Button>
                    </AvatarSelectionDialog>
                </VideoCreationProvider>
            </div>
        </div>
    );
}
