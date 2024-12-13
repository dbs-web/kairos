import { IVideo } from '@/types/video';
import { FiDownload } from 'react-icons/fi';

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
        <div key={video._id} className="mx-8 flex gap-x-12 rounded-xl bg-white p-6 shadow-md">
            <div className="flex min-w-56 flex-col gap-y-4">
                <video controls className="rounded-xl">
                    <source src={video.url} type="video/mp4" />
                </video>
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
                <span className="text-sm font-medium text-neutral-500">
                    DATA: <time>{new Date().toLocaleDateString()}</time>
                </span>

                <p className="mt-12 text-neutral-400">
                    <strong className="text-neutral-700">Legenda:</strong>
                    <br />
                    <br />
                    {video.legenda}
                </p>
            </div>
        </div>
    );
}
