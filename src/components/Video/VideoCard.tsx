// UI
import { FiDownload } from 'react-icons/fi';
import { PiSpinnerThin } from 'react-icons/pi';
import { BiErrorCircle } from 'react-icons/bi';
import TranscriptionDialog from './VideoTranscriptionDialog';
import { CiRedo } from 'react-icons/ci';

// Entities
import { IVideo } from '@/domain/entities/video';
import { HeyGenStatus } from '@prisma/client';
import { ScrollArea } from '../ui/scroll-area';
import VideoRedoDialog from './VideoRedoDialog';
import { redoVideo } from '@/services/client/video/redoVideo';
import { VideoCreationProvider } from '@/hooks/use-video-creation';

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

    return (
        <div className="flex flex-col gap-x-12 gap-y-6 rounded-xl bg-white p-3 shadow-md md:me-8 md:max-h-[65vh] md:flex-row md:p-6">
            <div className="grid min-w-56 grid-cols-1 grid-rows-[1fr_32px] gap-y-4 md:grid-rows-[1fr_48px]">
                {video.heygenStatus === 'SUCCESS' && (
                    <video
                        controls
                        className="max-h-[50vh] w-full rounded-xl"
                        style={{
                            aspectRatio: video.width === 1920 ? '16/9' : '9/16',
                        }}
                    >
                        <source src={video.url} type="video/mp4" />
                    </video>
                )}
                {video.heygenStatus === 'PROCESSING' && (
                    <div
                        className="grid animate-pulse items-center justify-center rounded-xl bg-neutral-300"
                        style={{
                            aspectRatio: video.width === 1920 ? '16/9' : '9/16',
                        }}
                    >
                        <PiSpinnerThin className="animate-ping text-xl drop-shadow-sm" />
                    </div>
                )}
                {video.heygenStatus === 'FAILED' && (
                    <div
                        className="grid items-center justify-center rounded-xl bg-neutral-900"
                        style={{
                            aspectRatio: video.width === 1920 ? '16/9' : '9/16',
                        }}
                    >
                        <BiErrorCircle className="text-lg text-red-500 md:text-xl xl:text-3xl" />
                    </div>
                )}

                <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-x-2 rounded-xl bg-secondary !p-0 text-center text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg md:py-2"
                >
                    <FiDownload />
                    Download
                </button>
            </div>
            <div className="relative flex w-full flex-col items-start justify-start pe-4">
                <div className="flex w-full items-center justify-between">
                    <div className="space-y-2">
                        <h2 className="font-medium md:text-lg">{video.title}</h2>
                        {video?.creationDate && (
                            <span className="text-xs font-medium text-neutral-500 md:text-sm">
                                DATA:{' '}
                                <time>
                                    {new Date(video.creationDate).toLocaleDateString('pt-br')}
                                </time>
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-x-2">
                        <VideoCreationProvider createVideo={redoVideo}>
                            <VideoRedoDialog video={video} />
                        </VideoCreationProvider>
                        <TranscriptionDialog video={video} />
                    </div>
                </div>

                {video.heygenStatus === HeyGenStatus.PROCESSING && (
                    <p className="mt-4 text-xs text-neutral-700 md:text-sm">
                        Aguarde enquanto estamos produzindo seu vídeo, isto pode demorar alguns
                        minutos.
                    </p>
                )}

                {video.heygenStatus === HeyGenStatus.FAILED && (
                    <p className="mt-12 text-xs text-neutral-600 md:text-sm">
                        <strong className="text-red-500">
                            Ocorreu um erro no processamento do seu vídeo:
                        </strong>
                        <br></br>
                        {video.heygenErrorMsg}
                    </p>
                )}

                {video.heygenStatus === HeyGenStatus.SUCCESS && (
                    <ScrollArea className="max-h-96">
                        <p className="mt-12 whitespace-pre-line text-xs text-neutral-600 md:text-sm">
                            {video.legenda}
                        </p>
                    </ScrollArea>
                )}
            </div>
        </div>
    );
}
