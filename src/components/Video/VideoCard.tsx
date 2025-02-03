import { IVideo } from '@/types/video';
import { FiDownload } from 'react-icons/fi';
import { PiSpinnerThin } from 'react-icons/pi';
import TranscriptionDialog from './VideoTranscriptionDialog';

interface VideoCardProps {
    video: IVideo;
}

export default function VideoCard({ video }: VideoCardProps) {
    const handleDownload = async () => {
        const response = await fetch(video.url);
        const blob = await response.blob();
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.download = `${video.title}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col gap-x-12 gap-y-6 rounded-xl bg-white p-3 shadow-md md:me-8 md:max-h-[65vh] md:flex-row md:p-6">
            <div className="grid min-w-56 grid-cols-1 grid-rows-[1fr_32px] gap-y-4 md:grid-rows-[1fr_48px]">
                {video.heygenStatus === 'SUCCESS' ? (
                    <video
                        controls
                        className="max-h-[50vh] w-full rounded-xl"
                        style={{
                            aspectRatio: video.width === 1920 ? '16/9' : '9/16',
                        }}
                    >
                        <source src={video.url} type="video/mp4" />
                    </video>
                ) : (
                    <div
                        className="grid animate-pulse items-center justify-center rounded-xl bg-neutral-300"
                        style={{
                            aspectRatio: video.width === 1920 ? '16/9' : '9/16',
                        }}
                    >
                        <PiSpinnerThin className="animate-ping text-xl drop-shadow-sm" />
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
            <div className="relative flex w-full flex-col items-start justify-start pe-8">
                <TranscriptionDialog video={video} />
                <h2 className="font-medium md:text-lg">{video.title}</h2>
                {video?.creationDate && (
                    <span className="text-xs font-medium text-neutral-500 md:text-sm">
                        DATA:{' '}
                        <time>{new Date(video.creationDate).toLocaleDateString('pt-br')}</time>
                    </span>
                )}
                {video.heygenStatus === 'PROCESSING' && (
                    <p className="mt-4 text-xs text-neutral-700 md:text-sm">
                        Aguarde enquanto estamos produzindo seu vídeo, isto pode demorar alguns minutos.
                    </p>
                )}

                {video.heygenStatus === 'FAILED' && (
                    <p className="mt-12 text-xs text-neutral-400 md:text-sm">
                        Ocorreu um erro no processamento do seu vídeo:
                        <br></br>
                        {video.heygenErrorMsg}
                    </p>
                )}
            </div>
        </div>
    );
}
