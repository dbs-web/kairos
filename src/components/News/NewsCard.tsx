import { useState } from 'react';

// UI
import StatusBadge from '../ui/status-badge';
import { MdChevronRight, MdImageNotSupported, MdOpenInNew, MdArticle } from 'react-icons/md';

// Entities
import { INews } from '@/domain/entities/news';

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
            className={`relative h-full w-full cursor-pointer rounded-lg bg-white p-4 [transition:transform_300ms,box-shadow_300ms] ${
                news.status === 'EM_ANALISE'
                    ? 'hover:-translate-y-2 hover:shadow-[0px_4px_6px_-2px_rgba(16,24,40,0.03),0px_12px_16px_-4px_rgba(16,24,40,0.08)]'
                    : 'cursor-not-allowed'
            }`}
            onClick={handleSelect}
        >
            <>
                <div
                    className={`absolute inset-0 rounded-lg transition-all duration-100 ${
                        isSelected ? 'border-2 border-primary' : 'border border-neutral-200'
                    }`}
                />
                {isSelected && (
                    <>
                        <div className="absolute left-0 top-0 h-8 w-8 rounded-tl-lg border-l-2 border-t-2 border-primary" />
                        <div className="absolute bottom-0 right-0 h-8 w-8 rounded-br-lg border-b-2 border-r-2 border-primary" />
                    </>
                )}
            </>

            <div className="relative flex h-full flex-col">
                {/* Changed rounded-xl to rounded-lg to match card corners */}
                <div className="relative mb-4 h-48 w-full shrink-0 overflow-hidden rounded-lg">
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

                <div className="flex flex-grow flex-col">
                    <div className="space-y-2">
                        <h3 className="line-clamp-2 text-lg font-semibold text-neutral-900 md:text-xl">
                            {news.title}
                        </h3>
                        <time className="block text-xs font-medium text-neutral-500">
                            {new Date(news.date).toLocaleDateString('pt-br')}
                        </time>
                    </div>

                    <p className="mt-4 line-clamp-3 flex-grow text-sm leading-relaxed text-neutral-600">
                        {news.summary}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                        <button
                            onClick={handleOpenNews}
                            className="group flex items-center gap-x-1.5 text-xs font-medium text-neutral-700 transition-colors hover:text-primary"
                        >
                            <MdOpenInNew className="text-sm transition-transform group-hover:rotate-12" />
                            Ver Notícia
                        </button>

                        <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                            {siteName}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
