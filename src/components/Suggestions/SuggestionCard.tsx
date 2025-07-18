'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MdImageNotSupported, MdThumbUp, MdThumbDown } from 'react-icons/md';
import StatusBadge from '../ui/status-badge';
import { ISuggestion } from '@/domain/entities/suggestion';

interface SuggestionCardProps {
    suggestion: ISuggestion;
    isSelected: boolean;
    onSelect: (id: number) => void;
    onApproachClick: (suggestion: ISuggestion, preselectedStance?: 'APOIAR' | 'REFUTAR') => void;
}

export default function SuggestionCard({ suggestion, isSelected, onSelect, onApproachClick }: SuggestionCardProps) {
    const [imageError, setImageError] = useState(false);
    const [userPhotoError, setUserPhotoError] = useState(false);

    const handleCardClick = () => {
        if (suggestion.status === 'EM_ANALISE') {
            onApproachClick(suggestion);
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
            <div
                className={`absolute inset-0 rounded-lg border transition-all duration-100 ${
                    isSelected ? 'border-2 border-primary' : 'border border-border'
                }`}
            />

            <div className="relative flex flex-col">
                {/* Profile Section - Top */}
                <div className="flex items-center gap-3 p-4 pb-2">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
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
                    <div className="flex-1">
                        <p className="font-medium text-foreground">@{suggestion.name_profile}</p>
                        <time className="text-xs text-muted-foreground">
                            {new Date(suggestion.date).toLocaleDateString('pt-BR')}
                        </time>
                    </div>
                    <StatusBadge status={suggestion.status} />
                </div>

                {/* Post Image - 4:5 aspect ratio */}
                <div className="relative mx-4 mb-4 overflow-hidden rounded-lg" style={{ aspectRatio: '4/5' }}>
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
                                <MdImageNotSupported className="text-4xl" />
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
                    <div className={`social-icon-overlay absolute top-2 right-2 rounded-full p-2 ${
                        suggestion.socialmedia_name === 'instagram' ? 'instagram' : ''
                    }`}>
                        <Image
                            src={getSocialIcon()}
                            alt={suggestion.socialmedia_name}
                            width={20}
                            height={20}
                            className={`${suggestion.socialmedia_name === 'instagram' ? 'social-icon-instagram' : 'social-icon-x'}`}
                        />
                    </div>
                </div>

                {/* Post Text */}
                <div className="px-4 mb-4">
                    <p className="line-clamp-3 text-sm leading-relaxed text-foreground/80">
                        {suggestion.post_text}
                    </p>
                </div>

                {/* Action Buttons - Option 1: Thematic */}
                <div className="flex gap-2 p-4 pt-0">
                    <button
                        onClick={handleApoiarClick}
                        disabled={suggestion.status !== 'EM_ANALISE'}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-teal-500 bg-teal-500/10 px-3 py-2 text-sm font-medium text-teal-500 transition-all duration-200 hover:bg-teal-500/20 hover:border-teal-400 hover:text-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdThumbUp className="text-base" />
                        Apoiar
                    </button>
                    <button
                        onClick={handleRefutarClick}
                        disabled={suggestion.status !== 'EM_ANALISE'}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-amber-600 bg-amber-600/10 px-3 py-2 text-sm font-medium text-amber-600 transition-all duration-200 hover:bg-amber-600/20 hover:border-amber-500 hover:text-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdThumbDown className="text-base" />
                        Refutar
                    </button>
                    <button
                        onClick={handleOpenPost}
                        className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Ver Post
                    </button>
                </div>
            </div>
        </div>
    );
}
