// UI
import { FiDownload } from 'react-icons/fi';
import { PiSpinnerThin } from 'react-icons/pi';
import { BiErrorCircle } from 'react-icons/bi';
import TranscriptionDialog from './VideoTranscriptionDialog';
import LegendaDialog from './LegendaDialog';

// Entities
import { IVideo } from '@/domain/entities/video';
import { HeyGenStatus } from '@prisma/client';
import { Button } from '../ui/button';

interface VideoCardProps {
    video: IVideo;
}

export default function VideoCard({ video }: VideoCardProps) {
    const handleDownload = async () => {
        if (video.url) {
            const response = await fetch(video.url);
            const blob = await response.blob();
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.href = url;
            link.download = `${video.title}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return URL.revokeObjectURL(url);
        }
    };

    // Determine if video is landscape or portrait
    const isLandscape = video.width === 1920;
    const aspectRatio = isLandscape ? 'aspect-video' : 'aspect-[9/16]';

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-primary/10">
            {/* Video Container */}
            <div className="group relative overflow-hidden rounded-t-xl">
                {/* Background placeholder with gradient */}
                <div className={`${aspectRatio} flex w-full items-center justify-center bg-gradient-to-b from-primary/5 to-primary/20`}></div>
                
                {/* Video content positioned absolutely */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {video.heygenStatus === 'SUCCESS' && (
                        <video controls className="h-full w-full object-contain">
                            <source src={video.url} type="video/mp4" />
                        </video>
                    )}
                    {video.heygenStatus === 'PROCESSING' && (
                        <div className="flex h-full w-full animate-pulse flex-col items-center justify-center">
                            <PiSpinnerThin className="mb-2 animate-spin text-3xl text-primary drop-shadow-sm" />
                            <p className="text-xs text-foreground/70">Processando seu vídeo...</p>
                        </div>
                    )}
                    {video.heygenStatus === 'FAILED' && (
                        <div className="flex h-full w-full flex-col items-center justify-center">
                            <BiErrorCircle className="mb-2 text-3xl text-destructive" />
                            <p className="px-4 text-center text-xs text-destructive/90">
                                Falha no processamento
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-grow flex-col p-3">
                <h2 className="mb-1 line-clamp-2 font-medium text-foreground">{video.title}</h2>
                {video?.creationDate && (
                    <span className="mb-2 text-xs font-medium text-muted-foreground">
                        {new Date(video.creationDate).toLocaleDateString('pt-br')}
                    </span>
                )}

                {video.heygenStatus === HeyGenStatus.FAILED && (
                    <p className="mb-2 line-clamp-2 text-xs text-destructive">
                        {video.heygenErrorMsg}
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex items-center justify-between border-t border-border px-3 py-2">
                <div className="flex gap-2">
                    <TranscriptionDialog video={video} />
                    <LegendaDialog video={video} />
                </div>

                <Button
                    onClick={handleDownload}
                    disabled={video.heygenStatus !== 'SUCCESS' || !video.url}
                    size="sm"
                    className="flex items-center gap-1 bg-gradient-to-r from-[#0085A3] to-primary text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                >
                    <FiDownload className="text-sm text-white" />
                    <span className="text-white">Download</span>
                </Button>
            </div>
        </div>
    );
}
