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
import { MdArticle, MdRefresh } from 'react-icons/md';

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
import { Button } from '../ui/button';

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
        <div className="relative flex h-full flex-col rounded-xl bg-card shadow-md transition-all duration-300 hover:-translate-y-1">
            {/* Simplificado: removemos o card-glow que pode estar interferindo */}
            <div className="absolute inset-0 rounded-xl border border-border transition-all duration-100" />

            {/* Cabeçalho do card */}
            <div className="flex items-start justify-between border-b border-border p-5">
                <div className="flex max-w-[80%] flex-col">
                    <h1 className="line-clamp-2 text-lg font-bold text-foreground">
                        {briefing.title}
                    </h1>
                    <div className="mt-2 flex items-center gap-x-3">
                        <time className="text-sm text-muted-foreground">
                            Data:{' '}
                            <strong className="text-foreground/80">
                                {briefing.date &&
                                    new Date(briefing.date).toLocaleDateString('pt-br')}
                            </strong>
                        </time>

                        {briefing.sources && (
                            <SourcesDialog sources={briefing.sources} title={briefing.title}>
                                <button className="group flex cursor-pointer items-center gap-x-1.5 text-xs font-medium text-foreground/70 transition-colors hover:text-primary">
                                    <MdArticle className="text-sm transition-colors group-hover:text-primary" />
                                    Ver Fonte
                                </button>
                            </SourcesDialog>
                        )}
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-border text-foreground/70 hover:border-primary/30 hover:text-foreground"
                        >
                            <BiDotsHorizontalRounded className="text-lg" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border-border bg-card">
                        <DropdownMenuLabel className="text-foreground">Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem
                            className="cursor-pointer text-foreground hover:text-destructive focus:text-destructive"
                            onClick={handleArchive}
                        >
                            Arquivar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Conteúdo do briefing */}
            <div className="flex-grow px-5 py-4">
                {briefing.status === Status.EM_PRODUCAO ? (
                    <TextFallBack />
                ) : (
                    // @ts-expect-error Briefing will always have text field
                    <MarkdownText text={briefing.text} />
                )}
            </div>

            {/* Botões de ação - Simplificados e com z-index mais alto */}
            <div className="relative z-10 grid grid-cols-3 gap-3 border-t border-border p-5">
                <RedoBriefingDialog briefing={briefing}>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full border-border text-foreground hover:border-border/80 hover:bg-muted"
                    >
                        <MdRefresh className="mr-2" />
                        Refazer
                    </Button>
                </RedoBriefingDialog>

                <EditBriefingDialog briefing={briefing}>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full border-border text-foreground hover:border-border/80 hover:bg-muted"
                    >
                        <FiEdit2 className="mr-2" />
                        Editar
                    </Button>
                </EditBriefingDialog>

                <VideoCreationProvider createVideo={createVideoBriefing}>
                    <AvatarSelectionDialog payload={{ briefingId: briefing.id }}>
                        <Button
                            type="button"
                            className="w-full bg-gradient-to-r from-[#0085A3] to-primary text-primary-foreground shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                        >
                            <CiCircleCheck className="mr-2 text-xl" />
                            Aprovar
                        </Button>
                    </AvatarSelectionDialog>
                </VideoCreationProvider>
            </div>
        </div>
    );
}
