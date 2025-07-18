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
        <div className="relative flex h-full flex-col rounded-xl bg-card shadow-md transition-all duration-300 hover:-translate-y-1">
            {/* Simplificado: removemos o card-glow que pode estar interferindo */}
            <div className="pointer-events-none absolute inset-0 rounded-xl border border-border transition-all duration-100" />

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

            {/* Botões de ação - Simplificados e com z-index mais alto */}
            <div className="relative z-10 flex gap-3 border-t border-border p-5">
                <RedoBriefingDialog briefing={briefing}>
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 border-border text-foreground hover:border-border/80 hover:bg-muted"
                    >
                        <MdRefresh className="mr-2" />
                        Trocar abordagem
                    </Button>
                </RedoBriefingDialog>

                <EditBriefingDialog briefing={briefing}>
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-none px-4 border-border text-foreground hover:border-border/80 hover:bg-muted"
                    >
                        <FiEdit2 className="mr-2" />
                        Editar
                    </Button>
                </EditBriefingDialog>

                <VideoCreationProvider createVideo={createVideoBriefing}>
                    <AvatarSelectionDialog payload={{ briefingId: briefing.id }}>
                        <Button
                            type="button"
                            className="flex-none px-4 bg-gradient-to-r from-[#0085A3] to-primary text-primary-foreground shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                        >
                            <CiCircleCheck className="mr-2 text-xl text-white" />
                            <span className="text-white">Aprovar</span>
                        </Button>
                    </AvatarSelectionDialog>
                </VideoCreationProvider>
            </div>
        </div>
    );
}
