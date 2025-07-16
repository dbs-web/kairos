'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MdImageNotSupported } from 'react-icons/md';
import StatusBadge from '../ui/status-badge';
import { ISuggestion } from '@/domain/entities/suggestion';

interface SuggestionCardProps {
    suggestion: ISuggestion;
    isSelected: boolean;
    onSelect: (id: number) => void;
}

export default function SuggestionCard({ suggestion, isSelected, onSelect }: SuggestionCardProps) {
    const [imageError, setImageError] = useState(false);
    const [userPhotoError, setUserPhotoError] = useState(false);

    const handleSelect = () => {
        if (suggestion.status === 'EM_ANALISE') {
            onSelect(suggestion.id);
        }
    };

    const handleOpenPost = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        window.open(suggestion.post_url, '_blank');
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

    const getProxiedImageUrl = (originalUrl: string | null) => {
        if (!originalUrl) return null;
        
        // If it's already a local URL, use it directly
        if (originalUrl.startsWith('/') || originalUrl.includes('localhost')) {
            return originalUrl;
        }
        
        // Use proxy for external URLs
        return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
    };

    return (
        <div
            onClick={handleSelect}
            className={`relative h-full w-full cursor-pointer rounded-lg bg-card p-4 transition-all duration-300 ${
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

            <div className="relative flex h-full flex-col">
                {/* Post Image */}
                <div className="relative mb-4 h-48 w-full shrink-0 overflow-hidden rounded-lg">
                    {imageError || !getProxiedImageUrl(suggestion.post_image) ? (
                        // Fallback: Different behavior for X vs Instagram
                        suggestion.socialmedia_name === 'x' ? (
                            // X: Blurred profile background
                            <div className="relative h-full w-full">
                                {/* Blurred profile background */}
                                {!userPhotoError && suggestion.user_photo ? (
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${getProxiedImageUrl(suggestion.user_photo)})`,
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
                            src={getProxiedImageUrl(suggestion.post_image)!}
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

                {/* Profile Section */}
                <div className="mb-3 flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        {userPhotoError || !getProxiedImageUrl(suggestion.user_photo) ? (
                            <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                                ?
                            </div>
                        ) : (
                            <Image
                                src={getProxiedImageUrl(suggestion.user_photo)!}
                                alt={suggestion.name_profile}
                                fill
                                className="object-cover"
                                onError={() => setUserPhotoError(true)}
                            />
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-foreground">{suggestion.name_profile}</p>
                        <time className="text-xs text-muted-foreground">
                            {new Date(suggestion.date).toLocaleDateString('pt-BR')}
                        </time>
                    </div>
                    <StatusBadge status={suggestion.status} />
                </div>

                {/* Post Text */}
                <div className="flex-grow">
                    <p className="line-clamp-3 text-sm leading-relaxed text-foreground/80">
                        {suggestion.post_text}
                    </p>
                </div>

                {/* Action Button */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleOpenPost}
                        className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Ver Post
                    </button>
                </div>
            </div>
        </div>
    );
}
