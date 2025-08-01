'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaInstagram, FaHeart, FaComment, FaEye, FaUsers, FaCheckCircle } from 'react-icons/fa';
import { BiTrendingUp, BiTrendingDown } from 'react-icons/bi';

interface InstagramProfile {
    id: string;
    username: string;
    account_type: string;
    media_count: number;
}

interface MediaPost {
    id: string;
    media_type: string;
    media_url: string;
    thumbnail_url?: string;
    caption?: string;
    timestamp: string;
    permalink: string;
}

interface MediaInsights {
    impressions: number;
    reach: number;
    engagement: number;
    likes: number;
    comments: number;
    saves: number;
    shares: number;
}

export default function DesempenhoPage() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const [profile, setProfile] = useState<InstagramProfile | null>(null);
    const [media, setMedia] = useState<MediaPost[]>([]);
    const [insights, setInsights] = useState<Record<string, MediaInsights>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        console.log('🔄 useEffect [session] triggered, session:', session?.user?.id);
        if (session?.user?.id) {
            console.log('📱 Loading Instagram data from session useEffect');
            loadInstagramData();
        }
    }, [session]);

    // Handle OAuth callback parameters
    useEffect(() => {
        const success = searchParams.get('success');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        const username = searchParams.get('username');

        if (success === 'true' && username) {
            console.log('🎉 OAuth success detected, username:', username);
            setSuccessMessage(`Instagram conectado com sucesso! Conta: @${username}`);
            setError(null);
            // Reload data after successful connection
            if (session?.user?.id) {
                console.log('⏰ Scheduling data reload in 1 second...');
                setTimeout(() => {
                    console.log('🔄 Reloading Instagram data after OAuth success');
                    loadInstagramData();
                }, 1000);
            }
        } else if (error) {
            setError(errorDescription || 'Erro ao conectar com Instagram');
            setSuccessMessage(null);
        }

        // Clear URL parameters after handling them
        if (success || error) {
            const url = new URL(window.location.href);
            url.searchParams.delete('success');
            url.searchParams.delete('error');
            url.searchParams.delete('error_description');
            url.searchParams.delete('username');
            url.searchParams.delete('account_type');
            url.searchParams.delete('account_id');
            window.history.replaceState({}, '', url.toString());
        }
    }, [searchParams, session]);

    const loadInstagramData = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Loading Instagram data for user:', session?.user?.id);

            // Check if user has Instagram token
            const tokenResponse = await fetch('/api/instagram/token/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: session?.user?.id })
            });

            console.log('Token check response:', tokenResponse.status, tokenResponse.ok);

            if (!tokenResponse.ok) {
                const errorText = await tokenResponse.text();
                console.log('Token check error:', errorText);
                throw new Error('Instagram não conectado');
            }

            // Get user profile
            const profileResponse = await fetch('/api/instagram/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: session?.user?.id })
            });

            if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                console.log('Profile data received:', profileData);

                // Handle profile data format - FIX: Access double-nested profile object
                console.log('Received profile data:', JSON.stringify(profileData, null, 2));
                
                // The API returns { profile: { profile: {...}, message: "..." }, message: "..." }
                // We need to access the double-nested profile object
                let profileInfo = profileData.profile?.profile || profileData.profile;

                if (profileInfo) {
                    console.log('✅ FIXED - Accessing double-nested profile object:', profileInfo);
                    
                    // Check if this is fallback data (indicates no real connection)
                    // Only consider it fallback if we have specific fallback indicators
                    const isFallbackData = profileInfo.username === 'instagram_user' ||
                                         profileInfo.id === 'unknown' ||
                                         profileInfo.error ||
                                         (profileInfo.note && profileInfo.note.includes('fallback'));

                    console.log('Fallback data check:', {
                        username: profileInfo.username,
                        id: profileInfo.id,
                        error: profileInfo.error,
                        note: profileInfo.note,
                        isFallbackData
                    });

                    if (isFallbackData) {
                        console.log('Detected fallback data, user needs to connect Instagram');
                        throw new Error('Instagram não conectado - dados de fallback detectados');
                    }

                    // Now we can safely access the real profile data
                    const processedProfile = {
                        id: profileInfo.id || 'unknown',
                        username: profileInfo.username || 'instagram_user',
                        account_type: profileInfo.account_type || 'BUSINESS',
                        media_count: profileInfo.media_count || 0
                    };
                    
                    console.log('✅ FIXED - Profile with real data:', processedProfile);
                    setProfile(processedProfile);
                    console.log('✅ Profile state set successfully');
                } else {
                    console.warn('No profile data in response');
                    throw new Error('Instagram não conectado - sem dados de perfil');
                }
            } else {
                console.error('Failed to load profile:', await profileResponse.text());
            }

            // Get user media
            const mediaResponse = await fetch('/api/instagram/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: session?.user?.id, limit: 12 })
            });

            if (mediaResponse.ok) {
                const mediaData = await mediaResponse.json();
                console.log('Media data received:', mediaData);

                // Handle Instagram API response format: { media: { data: [...] } }
                let mediaArray = [];
                if (mediaData.media) {
                    if (Array.isArray(mediaData.media)) {
                        // Direct array format
                        mediaArray = mediaData.media;
                    } else if (mediaData.media.data && Array.isArray(mediaData.media.data)) {
                        // Instagram Graph API format: { data: [...] }
                        mediaArray = mediaData.media.data;
                    }
                }

                console.log('Processed media array:', mediaArray);
                setMedia(mediaArray);

                // Get insights for each media post (only if we have media)
                if (mediaArray.length > 0) {
                    const insightsPromises = mediaArray.slice(0, 6).map(async (post: MediaPost) => {
                        try {
                            const insightResponse = await fetch(`/api/instagram/insights/${post.id}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ userId: session?.user?.id })
                            });

                            if (insightResponse.ok) {
                                const insightData = await insightResponse.json();
                                // Handle insights data format
                                const insights = insightData.insights;
                                if (insights && insights.data) {
                                    // Convert Instagram insights format to our format
                                    const processedInsights = {
                                        impressions: 0,
                                        reach: 0,
                                        engagement: 0,
                                        likes: 0,
                                        comments: 0,
                                        saves: 0,
                                        shares: 0
                                    };

                                    insights.data.forEach((metric: any) => {
                                        const value = metric.values?.[0]?.value || 0;
                                        switch (metric.name) {
                                            case 'impressions':
                                                processedInsights.impressions = value;
                                                break;
                                            case 'reach':
                                                processedInsights.reach = value;
                                                break;
                                            case 'likes':
                                                processedInsights.likes = value;
                                                break;
                                            case 'comments':
                                                processedInsights.comments = value;
                                                break;
                                            case 'saves':
                                                processedInsights.saves = value;
                                                break;
                                            case 'shares':
                                                processedInsights.shares = value;
                                                break;
                                        }
                                    });

                                    // Calculate engagement
                                    processedInsights.engagement = processedInsights.likes +
                                                                 processedInsights.comments +
                                                                 processedInsights.saves +
                                                                 processedInsights.shares;

                                    return { [post.id]: processedInsights };
                                }
                                return { [post.id]: insightData.insights };
                            }
                        } catch (err) {
                            console.error('Error loading insights for post:', post.id, err);
                        }
                        return null;
                    });

                    const insightsResults = await Promise.all(insightsPromises);
                    const insightsMap = insightsResults.reduce((acc, result) => {
                        if (result) Object.assign(acc, result);
                        return acc;
                    }, {});

                    console.log('Processed insights:', insightsMap);
                    setInsights(insightsMap);
                }
            } else {
                console.error('Failed to load media:', await mediaResponse.text());
                setMedia([]); // Set empty array if media fails to load
            }

        } catch (err) {
            console.error('Error loading Instagram data:', err);
            setError(err instanceof Error ? err.message : 'Erro ao carregar dados do Instagram');
        } finally {
            setLoading(false);
        }
    };

    const handleInstagramConnect = async () => {
        try {
            setConnecting(true);
            console.log('Starting Instagram connection...');

            // Get Instagram auth URL
            const response = await fetch('/api/instagram/auth/url', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('Auth URL response:', response.status, response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Auth URL error:', errorText);
                throw new Error('Erro ao obter URL de autorização');
            }

            const data = await response.json();
            console.log('Auth URL data:', data);

            // Redirect to Instagram OAuth
            console.log('Redirecting to:', data.auth_url);
            window.location.href = data.auth_url;

        } catch (err) {
            console.error('Error connecting Instagram:', err);
            setError('Erro ao conectar com Instagram. Tente novamente.');
        } finally {
            setConnecting(false);
        }
    };

    const handleDisconnectInstagram = async () => {
        try {
            setConnecting(true);
            console.log('Disconnecting Instagram...');

            const response = await fetch('/api/instagram/token/revoke', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: session?.user?.id })
            });

            if (!response.ok) {
                throw new Error('Erro ao desconectar Instagram');
            }

            // Clear local state
            setProfile(null);
            setMedia([]);
            setInsights({});
            setSuccessMessage('Instagram desconectado com sucesso!');
            setError(null);

        } catch (err) {
            console.error('Error disconnecting Instagram:', err);
            setError('Erro ao desconectar Instagram. Tente novamente.');
        } finally {
            setConnecting(false);
        }
    };

    const calculateAverageEngagement = () => {
        const validInsights = Object.values(insights).filter(insight => insight.engagement);
        if (validInsights.length === 0) return 0;
        
        const total = validInsights.reduce((sum, insight) => sum + insight.engagement, 0);
        return Math.round(total / validInsights.length);
    };

    const calculateAverageLikes = () => {
        const validInsights = Object.values(insights).filter(insight => insight.likes);
        if (validInsights.length === 0) return 0;
        
        const total = validInsights.reduce((sum, insight) => sum + insight.likes, 0);
        return Math.round(total / validInsights.length);
    };

    // Debug logging
    console.log('Current state:', { loading, error, profile: !!profile, connecting });
    
    // UI rendering debug
    if (profile) {
        console.log('🎨 Rendering profile in UI:', profile);
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Carregando dados do Instagram...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Card className="bg-red-900/20 border-red-500">
                    <CardContent className="p-6 text-center">
                        <FaInstagram className="mx-auto mb-4 text-4xl text-red-400" />
                        <h3 className="text-lg font-semibold text-white mb-2">Instagram não conectado</h3>
                        <p className="text-gray-400 mb-4">{error}</p>
                        <div className="space-y-2">
                            <Button
                                onClick={handleInstagramConnect}
                                disabled={connecting}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                            >
                                <FaInstagram className="mr-2" />
                                {connecting ? 'Conectando...' : 'Conectar Instagram'}
                            </Button>
                            <div className="text-xs text-gray-500">
                                Você será redirecionado para o Instagram para autorizar a conexão
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Success Message */}
            {successMessage && (
                <Card className="bg-green-900/20 border-green-500">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <FaCheckCircle className="text-green-400 text-xl" />
                            <div>
                                <p className="text-green-300 font-medium">{successMessage}</p>
                                <p className="text-green-400/70 text-sm">Os dados do Instagram estão sendo carregados...</p>
                            </div>
                            <Button
                                onClick={() => setSuccessMessage(null)}
                                variant="ghost"
                                size="sm"
                                className="ml-auto text-green-400 hover:bg-green-500/10"
                            >
                                ×
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Desempenho - Instagram</h1>
                    <p className="text-gray-400">Monitore o desempenho da sua conta do Instagram</p>
                </div>
                <Button
                    onClick={loadInstagramData}
                    variant="outline"
                    className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                >
                    Atualizar Dados
                </Button>
            </div>

            {/* Instagram Profile Info */}
            {profile && (
                <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FaInstagram className="text-2xl text-pink-400" />
                                <div>
                                    <span className="text-white">@{profile.username}</span>
                                    <Badge variant="secondary" className="ml-2 bg-purple-500/20 text-purple-300">
                                        {profile.account_type}
                                    </Badge>
                                </div>
                            </div>
                            <Button
                                onClick={handleDisconnectInstagram}
                                variant="outline"
                                size="sm"
                                className="text-red-400 border-red-400 hover:bg-red-400/10"
                            >
                                Desconectar
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{profile.media_count}</div>
                                <div className="text-sm text-gray-400">Posts</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{calculateAverageLikes()}</div>
                                <div className="text-sm text-gray-400">Média de Curtidas</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{calculateAverageEngagement()}</div>
                                <div className="text-sm text-gray-400">Engajamento Médio</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{Object.keys(insights).length}</div>
                                <div className="text-sm text-gray-400">Posts Analisados</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Posts */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-white">Posts Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {media.slice(0, 6).map((post) => {
                            const postInsights = insights[post.id];
                            return (
                                <div key={post.id} className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                                    {/* Media Preview */}
                                    <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                                        {post.media_type === 'IMAGE' && post.media_url && (
                                            <img
                                                src={post.media_url}
                                                alt="Instagram post"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        {post.media_type === 'VIDEO' && post.thumbnail_url && (
                                            <img
                                                src={post.thumbnail_url}
                                                alt="Video thumbnail"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    {/* Post Info */}
                                    <div className="space-y-2">
                                        <div className="text-xs text-gray-400">
                                            {new Date(post.timestamp).toLocaleDateString('pt-BR')}
                                        </div>

                                        {post.caption && (
                                            <p className="text-sm text-gray-300 line-clamp-2">
                                                {post.caption.substring(0, 100)}...
                                            </p>
                                        )}

                                        {/* Insights */}
                                        {postInsights && (
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="flex items-center gap-1 text-red-400">
                                                    <FaHeart className="text-xs" />
                                                    {postInsights.likes || 0}
                                                </div>
                                                <div className="flex items-center gap-1 text-blue-400">
                                                    <FaComment className="text-xs" />
                                                    {postInsights.comments || 0}
                                                </div>
                                                <div className="flex items-center gap-1 text-green-400">
                                                    <FaEye className="text-xs" />
                                                    {postInsights.reach || 0}
                                                </div>
                                                <div className="flex items-center gap-1 text-purple-400">
                                                    <BiTrendingUp className="text-xs" />
                                                    {postInsights.engagement || 0}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
