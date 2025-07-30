'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Simple icons as components since lucide-react might not be available
const Loader2 = ({ className }: { className?: string }) => (
    <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} />
);

const CheckCircle = ({ className }: { className?: string }) => (
    <div className={`rounded-full bg-green-500 text-white flex items-center justify-center ${className}`}>✓</div>
);

const XCircle = ({ className }: { className?: string }) => (
    <div className={`rounded-full bg-red-500 text-white flex items-center justify-center ${className}`}>✗</div>
);

const AlertTriangle = ({ className }: { className?: string }) => (
    <div className={`rounded-full bg-yellow-500 text-white flex items-center justify-center ${className}`}>!</div>
);

interface InstagramStatus {
    connected: boolean;
    accountId?: string;
    expiresAt?: string;
    expiresWarning?: boolean;
    message: string;
}

interface InstagramProfile {
    id: string;
    username: string;
    account_type: string;
    media_count: number;
}

export default function InstagramTestPage() {
    const [status, setStatus] = useState<InstagramStatus | null>(null);
    const [profile, setProfile] = useState<InstagramProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const { toast } = useToast();

    // Check Instagram connection status on page load
    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/instagram/status');
            const data = await response.json();
            setStatus(data);
            
            if (data.connected) {
                await fetchProfile();
            }
        } catch (error) {
            console.error('Error checking status:', error);
            toast({
                title: "Error",
                description: "Failed to check Instagram connection status",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/instagram/profile');
            if (response.ok) {
                const data = await response.json();
                setProfile(data.profile);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const connectInstagram = async () => {
        setConnecting(true);
        try {
            // Get authorization URL
            const response = await fetch('/api/instagram/connect');
            const data = await response.json();
            
            if (data.authUrl) {
                // Redirect to Instagram OAuth
                window.location.href = data.authUrl;
            } else {
                throw new Error('Failed to get authorization URL');
            }
        } catch (error) {
            console.error('Error connecting Instagram:', error);
            toast({
                title: "Error",
                description: "Failed to initiate Instagram connection",
                variant: "destructive"
            });
            setConnecting(false);
        }
    };

    const disconnectInstagram = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/instagram/disconnect', {
                method: 'POST'
            });
            
            if (response.ok) {
                setStatus({ connected: false, message: 'Instagram account disconnected' });
                setProfile(null);
                toast({
                    title: "Success",
                    description: "Instagram account disconnected successfully"
                });
            } else {
                throw new Error('Failed to disconnect');
            }
        } catch (error) {
            console.error('Error disconnecting Instagram:', error);
            toast({
                title: "Error",
                description: "Failed to disconnect Instagram account",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = () => {
        if (loading) return <Loader2 className="h-5 w-5" />;
        if (!status) return <XCircle className="h-5 w-5" />;
        if (status.connected && status.expiresWarning) return <AlertTriangle className="h-5 w-5" />;
        if (status.connected) return <CheckCircle className="h-5 w-5" />;
        return <XCircle className="h-5 w-5" />;
    };

    const getStatusBadge = () => {
        if (!status) return <Badge variant="secondary">Unknown</Badge>;
        if (status.connected && status.expiresWarning) return <Badge variant="destructive">Expires Soon</Badge>;
        if (status.connected) return <Badge variant="default">Connected</Badge>;
        return <Badge variant="secondary">Not Connected</Badge>;
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Instagram Integration Test</h1>
                <p className="text-muted-foreground mt-2">
                    Test the Instagram OAuth flow and basic data fetching
                </p>
            </div>

            <div className="grid gap-6">
                {/* Connection Status Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {getStatusIcon()}
                            Connection Status
                        </CardTitle>
                        <CardDescription>
                            Current Instagram account connection status
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span>Status:</span>
                            {getStatusBadge()}
                        </div>
                        
                        {status?.connected && (
                            <>
                                <div className="flex items-center justify-between">
                                    <span>Account ID:</span>
                                    <code className="text-sm bg-muted px-2 py-1 rounded">
                                        {status.accountId}
                                    </code>
                                </div>
                                
                                {status.expiresAt && (
                                    <div className="flex items-center justify-between">
                                        <span>Expires:</span>
                                        <span className="text-sm">
                                            {new Date(status.expiresAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                        
                        <p className="text-sm text-muted-foreground">
                            {status?.message || 'Checking connection status...'}
                        </p>
                        
                        <div className="flex gap-2">
                            {status?.connected ? (
                                <>
                                    <Button
                                        onClick={checkStatus}
                                        variant="outline"
                                        disabled={loading}
                                    >
                                        {loading && <Loader2 className="mr-2 h-4 w-4" />}
                                        Refresh Status
                                    </Button>
                                    <Button 
                                        onClick={disconnectInstagram} 
                                        variant="destructive"
                                        disabled={loading}
                                    >
                                        Disconnect
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={connectInstagram}
                                    disabled={connecting}
                                >
                                    {connecting && <Loader2 className="mr-2 h-4 w-4" />}
                                    Connect Instagram
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Information Card */}
                {status?.connected && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Basic Instagram Business account information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {profile ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span>Username:</span>
                                        <span className="font-medium">@{profile.username}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Account Type:</span>
                                        <Badge variant="outline">{profile.account_type}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Media Count:</span>
                                        <span>{profile.media_count} posts</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4" />
                                    <span>Loading profile information...</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Test Results */}
                <Card>
                    <CardHeader>
                        <CardTitle>Test Results</CardTitle>
                        <CardDescription>
                            Milestone 1 testing checklist
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                {status?.connected ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                <span>OAuth flow works</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {profile ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                <span>Profile data displays</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {status ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                <span>Connection status checking</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
