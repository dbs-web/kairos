'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MdImageNotSupported, MdThumbUp, MdThumbDown, MdOpenInNew, MdArticle } from 'react-icons/md';
import StatusBadge from '../ui/status-badge';
import { ISuggestion } from '@/domain/entities/suggestion';

interface SuggestionCardProps {
    suggestion: ISuggestion;
    isSelected: boolean;
    hasApproach: boolean;
    savedStance?: 'APOIAR' | 'REFUTAR';
    onSelect: (id: number) => void;
    onApproachClick: (suggestion: ISuggestion, preselectedStance?: 'APOIAR' | 'REFUTAR') => void;
}

export default function SuggestionCard({ suggestion, isSelected, hasApproach, savedStance, onSelect, onApproachClick }: SuggestionCardProps) {
    const [imageError, setImageError] = useState(false);
    const [userPhotoError, setUserPhotoError] = useState(false);

    const handleCardClick = () => {
        if (suggestion.status === 'EM_ANALISE') {
            if (isSelected && hasApproach) {
                // If already selected and has approach, deselect
                onSelect(suggestion.id);
            } else if (!isSelected) {
                // If not selected, open approach dialog
                onApproachClick(suggestion);
            } else {
                // If selected but no approach, open approach dialog
                onApproachClick(suggestion);
            }
        }
    };

    const handleOpenPost = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        window.open(suggestion.post_url, '_blank');
    };

    const handleApoiarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (suggestion.status === 'EM_ANALISE') {
            onApproachClick(suggestion, 'APOIAR');
        }
    };

    const handleRefutarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (suggestion.status === 'EM_ANALISE') {
            onApproachClick(suggestion, 'REFUTAR');
        }
    };

    const handleApproachClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onApproachClick(suggestion);
    };

    const getSocialIcon = () => {
        return suggestion.socialmedia_name === 'instagram'
            ? 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg'
            : 'https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg';
    };
    const getSocialIconStyle = () => {
        if (suggestion.socialmedia_name === 'instagram') {
            return 'brightness-0 invert'; // Makes Instagram logo white
        } else {
            return 'brightness-0 invert'; // Makes X logo white
        }
    };

    return (
        <div
            onClick={handleCardClick}
            className={`relative w-full cursor-pointer rounded-lg bg-card transition-all duration-300 ${
                suggestion.status === 'EM_ANALISE'
                    ? 'card-glow hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/10'
                    : 'cursor-not-allowed opacity-75'
            } ${isSelected ? 'card-glow selected' : ''}`}
        >
            <>
                <div
                    className={`absolute inset-0 rounded-lg transition-all duration-100 ${
                        isSelected ? 'border-2 border-primary' : 'border border-border'
                    }`}
                />
                {isSelected && (
                    <>
                        <div className="absolute left-0 top-0 h-8 w-8 rounded-tl-lg border-l-2 border-t-2 border-primary" />
                        <div className="absolute bottom-0 right-0 h-8 w-8 rounded-br-lg border-b-2 border-r-2 border-primary" />
                    </>
                )}
            </>

            <div className="relative flex flex-col min-h-0">
                {/* Profile Section - Top */}
                <div className="flex items-center gap-2 p-3 pb-2 sm:gap-3 sm:p-4 sm:pb-2">
                    <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full sm:h-10 sm:w-10">
                        {userPhotoError || !suggestion.user_photo ? (
                            <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                                ?
                            </div>
                        ) : (
                            <Image
                                src={suggestion.user_photo!}
                                alt={suggestion.name_profile}
                                fill
                                className="object-cover"
                                onError={() => setUserPhotoError(true)}
                            />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm sm:text-base truncate">@{suggestion.name_profile}</p>
                        <time className="text-xs text-muted-foreground">
                            {new Date(suggestion.date).toLocaleDateString('pt-BR')}
                        </time>
                    </div>
                    <div className="flex-shrink-0">
                        <StatusBadge status={suggestion.status} />
                    </div>
                </div>

                {/* Post Image - 4:5 aspect ratio */}
                <div className="relative mx-3 mb-3 overflow-hidden rounded-lg sm:mx-4 sm:mb-4" style={{ aspectRatio: '4/5' }}>
                    {imageError || !suggestion.post_image ? (
                        // Fallback: Different behavior for X vs Instagram
                        suggestion.socialmedia_name === 'x' ? (
                            // X: Blurred profile background
                            <div className="relative h-full w-full">
                                {/* Blurred profile background */}
                                {!userPhotoError && suggestion.user_photo ? (
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${suggestion.user_photo})`,
                                            filter: 'blur(5px) brightness(0.7)',
                                            transform: 'scale(1.1)' // Prevents blur edge artifacts
                                        }}
                                    />
                                ) : (
                                    // Fallback gradient if user photo also fails
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                                )}
                                {/* Dark overlay */}
                                <div className="absolute inset-0 bg-black/40" />
                            </div>
                        ) : (
                            // Instagram: Show image not supported icon
                            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                <MdImageNotSupported className="text-2xl sm:text-4xl" />
                            </div>
                        )
                    ) : (
                        <Image
                            src={suggestion.post_image!}
                            alt="Post content"
                            fill
                            className="object-cover"
                            onError={() => setImageError(true)}
                        />
                    )}

                    {/* Social Media Icon Overlay */}
                    <div className={`social-icon-overlay absolute top-1.5 right-1.5 rounded-full p-1.5 sm:top-2 sm:right-2 sm:p-2 ${
                        suggestion.socialmedia_name === 'instagram' ? 'instagram' : ''
                    }`}>
                        <Image
                            src={getSocialIcon()}
                            alt={suggestion.socialmedia_name}
                            width={16}
                            height={16}
                            className={`sm:w-5 sm:h-5 ${suggestion.socialmedia_name === 'instagram' ? 'social-icon-instagram' : 'social-icon-x'}`}
                        />
                    </div>
                </div>

                {/* Post Text */}
                <div className="px-3 mb-3 sm:px-4 sm:mb-4">
                    <p className="line-clamp-3 text-xs leading-relaxed text-foreground/80 sm:text-sm">
                        {suggestion.post_text}
                    </p>
                </div>

                {/* Action Buttons - Hybrid: Gray default, Thematic hover */}
                <div className="flex flex-col gap-2 p-3 pt-0 sm:flex-row sm:p-4 sm:pt-0">
                    <div className="flex gap-2">
                        <button
                            onClick={handleApoiarClick}
                            disabled={suggestion.status !== 'EM_ANALISE'}
                            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border-2 px-2 py-1.5 text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed sm:gap-2 sm:px-3 sm:py-2 sm:text-sm ${
                                savedStance === 'APOIAR'
                                    ? 'border-teal-500 bg-teal-500/10 text-teal-500'
                                    : 'border-slate-600 bg-transparent text-slate-400 hover:bg-teal-500/10 hover:border-teal-500 hover:text-teal-500'
                            }`}
                        >
                            <MdThumbUp className="text-sm sm:text-base" />
                            Apoiar
                        </button>
                        <button
                            onClick={handleRefutarClick}
                            disabled={suggestion.status !== 'EM_ANALISE'}
                            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border-2 px-2 py-1.5 text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed sm:gap-2 sm:px-3 sm:py-2 sm:text-sm ${
                                savedStance === 'REFUTAR'
                                    ? 'border-amber-600 bg-amber-600/10 text-amber-600'
                                    : 'border-slate-600 bg-transparent text-slate-400 hover:bg-amber-600/10 hover:border-amber-600 hover:text-amber-600'
                            }`}
                        >
                            <MdThumbDown className="text-sm sm:text-base" />
                            Refutar
                        </button>
                    </div>
                    <button
                        onClick={handleOpenPost}
                        className="group flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 font-medium transition-colors duration-200 sm:flex-1 sm:px-3 sm:py-2"
                        style={{
                            backgroundColor: 'hsl(var(--primary)/.2)',
                            color: 'hsl(var(--primary))',
                            fontSize: '12px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'hsl(var(--primary)/.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'hsl(var(--primary)/.2)';
                        }}
                    >
                        <MdOpenInNew className="text-xs transition-transform group-hover:rotate-12 sm:text-sm" />
                        Ver Post
                    </button>
                </div>

                {/* Approach button for selected cards with saved approach */}
                {isSelected && hasApproach && (
                    <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                        <button
                            onClick={handleApproachClick}
                            className="w-full flex items-center justify-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/20 hover:text-white"
                        >
                            <MdArticle className="text-sm text-white" />
                            <span className="text-white">Trocar abordagem</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
