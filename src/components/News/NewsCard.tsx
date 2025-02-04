import { useState } from 'react';
import { INews } from '@/types/news';
import StatusBadge from '../ui/status-badge';
import { MdChevronRight, MdImageNotSupported } from 'react-icons/md';

interface NewsCardProps {
    news: INews;
    isSelected: boolean;
    onSelect: (id: number) => void;
}

export default function NewsCard({ news, isSelected, onSelect }: NewsCardProps) {
    const [imageError, setImageError] = useState(false);
    const handleSelect = () => {
        if (news.status === 'EM_ANALISE') {
            onSelect(news.id);
        }
    };

    const handleOpenNews = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        window.open(news.url, '_blank');
    };

    const getSiteName = (url: string) => {
        const regex = /(?:https?:\/\/)?(?:www\.)?([^\/:]+)/;
        const match = url.match(regex);
        return match ? match[1] : '';
    };

    const siteName = getSiteName(news.url);

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div
            className={`cursor-pointer space-y-4 rounded-lg border bg-white p-5 transition-all duration-300 sm:mx-4 ${
                news.status === 'EM_ANALISE'
                    ? isSelected
                        ? 'border border-primary/50 shadow-md shadow-primary/70'
                        : 'hover:shadow-sm'
                    : 'cursor-not-allowed'
            }`}
            onClick={handleSelect}
        >
            <div className="relative h-48 w-full overflow-hidden rounded-xl border drop-shadow-md">
                {imageError || !news.thumbnail ? (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-300 text-neutral-500">
                        <MdImageNotSupported className="text-4xl" />
                    </div>
                ) : (
                    <img
                        src={news.thumbnail}
                        alt={news.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={handleImageError}
                    />
                )}
            </div>
            <div className="flex w-full items-start justify-between gap-x-2">
                <div className="flex !max-w-[70%] flex-col items-start">
                    <h3 className="md:text-md line-clamp-2 text-sm font-medium text-neutral-700">
                        {news.title}
                    </h3>
                    <span className="text-xs text-neutral-500 md:text-sm">
                        Data: {new Date(news.date).toLocaleDateString()}
                    </span>
                </div>
                <StatusBadge status={news.status} />
            </div>
            <p className="mt-4 line-clamp-3 text-xs text-neutral-500">{news.summary}</p>
            <div className="flex w-full items-center justify-between">
                <button
                    onClick={handleOpenNews}
                    className="flex items-center gap-x-2 border-0 text-xs text-neutral-600 transition-all duration-300 hover:text-neutral-800 md:text-sm"
                >
                    Ver Notícia
                    <MdChevronRight className="mt-0.5 text-lg" />
                </button>
                <span className="ml-auto rounded-lg bg-primary px-2 py-1 text-xs text-white md:text-sm">
                    {siteName}
                </span>
            </div>
        </div>
    );
}
