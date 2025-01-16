import { IVideo } from '@/types/video';
import { FiDownload } from 'react-icons/fi';
import { PiSpinnerThin } from 'react-icons/pi';

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
        <div
            key={video.id}
            className="me-8 flex max-h-[65vh] gap-x-12 rounded-xl bg-white p-6 shadow-md"
        >
            <div className="grid min-w-56 grid-cols-1 grid-rows-[1fr_48px] gap-y-4">
                {video.heygenStatus === 'SUCCESS' ? (
                    <video
                        controls
                        className="max-h-[50vh] rounded-xl"
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
                    className="flex items-center justify-center gap-x-2 rounded-xl bg-secondary py-2 text-center text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                    <FiDownload />
                    Download
                </button>
            </div>
            <div className="flex flex-col items-start justify-start">
                <h2 className="text-lg font-medium">{video.title}</h2>
                {video?.creationDate && (
                    <span className="text-sm font-medium text-neutral-500">
                        DATA:{' '}
                        <time>{new Date(video.creationDate).toLocaleDateString('pt-br')}</time>
                    </span>
                )}
                {video.legenda ? (
                    <p className="mt-12 text-neutral-400">
                        <strong className="text-neutral-700">Legenda:</strong>
                        <br />
                        <br />
                        {video.legenda}
                    </p>
                ) : (
                    <p className="mt-4 text-neutral-700">
                        Aguarde enquanto estamos produzindo seu vídeo
                    </p>
                )}
            </div>
        </div>
    );
}
