'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Simple icons
const Loader2 = ({ className }: { className?: string }) => (
    <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} />
);

const CheckCircle = ({ className }: { className?: string }) => (
    <div className={`rounded-full bg-green-500 text-white flex items-center justify-center ${className}`}>✓</div>
);

const XCircle = ({ className }: { className?: string }) => (
    <div className={`rounded-full bg-red-500 text-white flex items-center justify-center ${className}`}>✗</div>
);

export default function InstagramCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const [processing, setProcessing] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const handleCallback = () => {
            try {
                const successParam = searchParams.get('success');
                const errorParam = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');

                if (errorParam) {
                    const errorMessage = errorDescription || `Instagram authorization failed: ${errorParam}`;
                    setError(errorMessage);

                    toast({
                        title: "Error",
                        description: errorMessage,
                        variant: "destructive"
                    });
                    return;
                }

                if (successParam === 'true') {
                    // Extract profile information from URL parameters
                    const profileData = {
                        username: searchParams.get('username') || 'Unknown',
                        account_type: searchParams.get('account_type') || 'Unknown',
                        id: searchParams.get('account_id') || 'Unknown'
                    };

                    setProfile(profileData);
                    setSuccess(true);

                    toast({
                        title: "Success!",
                        description: "Instagram account connected successfully"
                    });
                } else {
                    setError('No success or error parameter found in callback');
                }

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                setError(errorMessage);

                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive"
                });
            } finally {
                setProcessing(false);
            }
        };

        handleCallback();
    }, [searchParams, toast]);

    const goBackToTest = () => {
        router.push('/panel/instagram-test');
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Instagram Connection</h1>
                <p className="text-muted-foreground mt-2">
                    Processing Instagram authorization...
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {processing && <Loader2 className="h-5 w-5" />}
                        {success && <CheckCircle className="h-5 w-5" />}
                        {error && <XCircle className="h-5 w-5" />}
                        
                        {processing && "Processing..."}
                        {success && "Connection Successful!"}
                        {error && "Connection Failed"}
                    </CardTitle>
                    <CardDescription>
                        {processing && "Exchanging authorization code for access token..."}
                        {success && "Your Instagram account has been connected successfully."}
                        {error && "There was an error connecting your Instagram account."}
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    {processing && (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4" />
                            <span>Please wait while we connect your Instagram account...</span>
                        </div>
                    )}

                    {success && profile && (
                        <div className="space-y-3">
                            <h3 className="font-semibold">Connected Account:</h3>
                            <div className="bg-muted p-4 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                    <span>Username:</span>
                                    <span className="font-medium">@{profile.username}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Account Type:</span>
                                    <span className="font-medium">{profile.account_type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Account ID:</span>
                                    <code className="text-sm bg-background px-2 py-1 rounded">
                                        {profile.id}
                                    </code>
                                </div>
                                {profile.media_count !== undefined && (
                                    <div className="flex justify-between">
                                        <span>Media Count:</span>
                                        <span>{profile.media_count} posts</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                            <h3 className="font-semibold text-destructive mb-2">Error Details:</h3>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-2 pt-4">
                        <Button onClick={goBackToTest} variant="outline">
                            Back to Test Page
                        </Button>
                        
                        {success && (
                            <Button onClick={() => router.push('/panel/redes-sociais')}>
                                Go to Social Media Dashboard
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Debug Information */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Debug Information</CardTitle>
                    <CardDescription>
                        Technical details for troubleshooting
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <div>
                            <strong>Success Parameter:</strong> {searchParams.get('success') || 'Not provided'}
                        </div>
                        <div>
                            <strong>Error Parameter:</strong> {searchParams.get('error') || 'None'}
                        </div>
                        <div>
                            <strong>Error Description:</strong> {searchParams.get('error_description') || 'None'}
                        </div>
                        <div>
                            <strong>Processing Status:</strong> {processing ? 'In Progress' : 'Complete'}
                        </div>
                        <div>
                            <strong>Username:</strong> {searchParams.get('username') || 'Not provided'}
                        </div>
                        <div>
                            <strong>Account ID:</strong> {searchParams.get('account_id') || 'Not provided'}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
