import { useState } from 'react';

// UI
import StatusBadge from '../ui/status-badge';
import { MdChevronRight, MdImageNotSupported, MdOpenInNew, MdArticle } from 'react-icons/md';

// Entities
import { INews } from '@/domain/entities/news';

interface NewsCardProps {
    news: INews;
    onApproachClick: (news: INews) => void;
}

export default function NewsCard({ news, onApproachClick }: NewsCardProps) {
    const [imageError, setImageError] = useState(false);

    const handleCardClick = () => {
        if (news.status === 'EM_ANALISE') {
            onApproachClick(news);
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
            onClick={handleCardClick}
            className={`relative h-full w-full rounded-lg bg-card p-4 transition-all duration-300 ${
                news.status === 'EM_ANALISE'
                    ? 'cursor-pointer card-glow hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/10'
                    : 'cursor-not-allowed opacity-75'
            }`}
        >

            <div className="relative flex h-full flex-col">
                <div className="relative mb-4 h-48 w-full shrink-0 overflow-hidden rounded-lg">
                    {imageError || !news.thumbnail ? (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
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
                        <h3 className="line-clamp-2 text-lg font-semibold text-foreground md:text-xl">
                            {news.title}
                        </h3>
                        <time className="block text-xs font-medium text-muted-foreground">
                            {new Date(news.date).toLocaleDateString('pt-br')}
                        </time>
                    </div>

                    <p className="mt-4 line-clamp-3 flex-grow text-sm leading-relaxed text-foreground/80">
                        {news.summary}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                        <button
                            onClick={handleOpenNews}
                            className="group flex items-center gap-x-1.5 text-xs font-medium text-foreground/70 transition-colors hover:text-primary"
                        >
                            <MdOpenInNew className="text-sm transition-transform group-hover:rotate-12" />
                            Ver Notícia
                        </button>

                        <span className="rounded-lg bg-primary/20 px-2.5 py-1 text-xs font-medium text-primary">
                            {siteName}
                        </span>
                    </div>


                </div>
            </div>
        </div>
    );
}
