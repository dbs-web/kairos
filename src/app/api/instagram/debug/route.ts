import { NextRequest, NextResponse } from 'next/server';
import { InstagramService } from '@/services/InstagramService';
import { InstagramTokenService } from '@/services/InstagramTokenService';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();
        console.log('🔍 INSTAGRAM DEBUG - Starting comprehensive diagnosis for user:', userId);

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const diagnostics: any = {
            timestamp: new Date().toISOString(),
            userId,
            tests: {}
        };

        // Test 1: Check token and account ID
        console.log('🔍 INSTAGRAM DEBUG - Test 1: Token and Account ID');
        try {
            const accessToken = await InstagramTokenService.getToken(userId);
            const accountId = await InstagramTokenService.getAccountId(userId);
            
            diagnostics.tests.tokenCheck = {
                hasToken: !!accessToken,
                tokenLength: accessToken?.length || 0,
                accountId: accountId || 'none',
                status: accessToken ? 'PASS' : 'FAIL'
            };
            console.log('🔍 INSTAGRAM DEBUG - Token check result:', diagnostics.tests.tokenCheck);
        } catch (error) {
            diagnostics.tests.tokenCheck = {
                status: 'ERROR',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }

        // Test 2: Profile data
        console.log('🔍 INSTAGRAM DEBUG - Test 2: Profile Data');
        try {
            const profile = await InstagramService.getUserProfile(userId);
            diagnostics.tests.profileCheck = {
                status: 'PASS',
                hasProfile: !!profile,
                profileData: profile,
                accountType: profile?.account_type,
                mediaCount: profile?.media_count
            };
            console.log('🔍 INSTAGRAM DEBUG - Profile check result:', diagnostics.tests.profileCheck);
        } catch (error) {
            diagnostics.tests.profileCheck = {
                status: 'ERROR',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }

        // Test 3: Media data
        console.log('🔍 INSTAGRAM DEBUG - Test 3: Media Data');
        try {
            const media = await InstagramService.getUserMedia(userId, 5);
            const mediaArray = Array.isArray(media) ? media : (media?.data || []);
            
            diagnostics.tests.mediaCheck = {
                status: 'PASS',
                hasMedia: mediaArray.length > 0,
                mediaCount: mediaArray.length,
                sampleMedia: mediaArray[0] || null,
                mediaIds: mediaArray.map((m: any) => m.id).slice(0, 3)
            };
            console.log('🔍 INSTAGRAM DEBUG - Media check result:', diagnostics.tests.mediaCheck);
        } catch (error) {
            diagnostics.tests.mediaCheck = {
                status: 'ERROR',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }

        // Test 4: Media insights (if we have media)
        console.log('🔍 INSTAGRAM DEBUG - Test 4: Media Insights');
        if (diagnostics.tests.mediaCheck?.mediaIds?.length > 0) {
            try {
                const mediaId = diagnostics.tests.mediaCheck.mediaIds[0];
                const insights = await InstagramService.getMediaInsights(userId, mediaId);
                
                diagnostics.tests.mediaInsightsCheck = {
                    status: 'PASS',
                    mediaId,
                    hasInsights: !!insights,
                    insightsData: insights,
                    metricsAvailable: insights?.data?.map((m: any) => m.name) || []
                };
                console.log('🔍 INSTAGRAM DEBUG - Media insights check result:', diagnostics.tests.mediaInsightsCheck);
            } catch (error) {
                diagnostics.tests.mediaInsightsCheck = {
                    status: 'ERROR',
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        } else {
            diagnostics.tests.mediaInsightsCheck = {
                status: 'SKIPPED',
                reason: 'No media available'
            };
        }

        // Test 5: Account insights
        console.log('🔍 INSTAGRAM DEBUG - Test 5: Account Insights');
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            
            const accountInsights = await InstagramService.getAccountInsights(
                userId,
                'day',
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0]
            );
            
            diagnostics.tests.accountInsightsCheck = {
                status: 'PASS',
                hasInsights: !!accountInsights,
                insightsData: accountInsights,
                metricsAvailable: accountInsights?.insights?.data?.map((m: any) => m.name) || []
            };
            console.log('🔍 INSTAGRAM DEBUG - Account insights check result:', diagnostics.tests.accountInsightsCheck);
        } catch (error) {
            diagnostics.tests.accountInsightsCheck = {
                status: 'ERROR',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }

        // Test 6: Audience insights
        console.log('🔍 INSTAGRAM DEBUG - Test 6: Audience Insights');
        try {
            const audienceInsights = await InstagramService.getAudienceInsights(userId, 'lifetime');
            
            diagnostics.tests.audienceInsightsCheck = {
                status: 'PASS',
                hasInsights: !!audienceInsights,
                insightsData: audienceInsights,
                metricsAvailable: audienceInsights?.insights?.data?.map((m: any) => m.name) || []
            };
            console.log('🔍 INSTAGRAM DEBUG - Audience insights check result:', diagnostics.tests.audienceInsightsCheck);
        } catch (error) {
            diagnostics.tests.audienceInsightsCheck = {
                status: 'ERROR',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }

        // Test 7: Time series data from database
        console.log('🔍 INSTAGRAM DEBUG - Test 7: Time Series Data');
        try {
            const timeSeriesData = await InstagramService.getTimeSeriesData(userId, 30);
            
            diagnostics.tests.timeSeriesCheck = {
                status: 'PASS',
                hasData: timeSeriesData.length > 0,
                dataPoints: timeSeriesData.length,
                sampleData: timeSeriesData[0] || null,
                dateRange: timeSeriesData.length > 0 ? {
                    first: timeSeriesData[0]?.date,
                    last: timeSeriesData[timeSeriesData.length - 1]?.date
                } : null
            };
            console.log('🔍 INSTAGRAM DEBUG - Time series check result:', diagnostics.tests.timeSeriesCheck);
        } catch (error) {
            diagnostics.tests.timeSeriesCheck = {
                status: 'ERROR',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }

        // Summary
        const passedTests = Object.values(diagnostics.tests).filter((test: any) => test.status === 'PASS').length;
        const totalTests = Object.keys(diagnostics.tests).length;
        
        diagnostics.summary = {
            passedTests,
            totalTests,
            successRate: `${Math.round((passedTests / totalTests) * 100)}%`,
            criticalIssues: Object.entries(diagnostics.tests)
                .filter(([_, test]: [string, any]) => test.status === 'ERROR')
                .map(([name, test]: [string, any]) => ({ test: name, error: test.error }))
        };

        console.log('🔍 INSTAGRAM DEBUG - Final summary:', diagnostics.summary);

        return NextResponse.json({
            message: 'Instagram API diagnostic completed',
            diagnostics
        });

    } catch (error) {
        console.error('🔍 INSTAGRAM DEBUG - Diagnostic error:', error);
        
        return NextResponse.json(
            { 
                error: 'Failed to run Instagram diagnostics',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
