import { InstagramTokenService } from './InstagramTokenService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types based on colleague's BASE 1 & 2 structure
export interface TimeSeriesData {
    date: string;
    reach: number;
    followerChange: number;
}

export interface DailySummary {
    date: string;
    profileViews: number;
    accountsEngaged: number;
}

export interface Demographics {
    genderAge: Record<string, number>; // F_25-34, M_35-44, etc.
    cities: Record<string, number>;
}

export interface MediaInsights {
    total_interactions: number;
    reach: number;
    saved: number;
    likes: number;
    comments: number;
    shares: number;
    views: number;
}

export interface MediaSnapshot {
    mediaId: string;
    snapshotTimestamp: string;
    insights: MediaInsights;
}

export interface DailySnapshot {
    instagramAccountId: string;
    snapshotTimestamp: string;
    timeSeriesData: TimeSeriesData[];
    latestDailySummary: DailySummary;
    lifetimeDemographics: Demographics;
}

export class InstagramService {
    private static readonly INSTAGRAM_API_BASE = process.env.INSTAGRAM_API_BASE || 'https://api.dbsweb.com.br/instagram';

    /**
     * Make authenticated request to Instagram API
     */
    private static async makeInstagramAPIRequest(
        endpoint: string,
        accessToken: string,
        method: 'GET' | 'POST' = 'POST',
        body?: any
    ): Promise<any> {
        const url = `${this.INSTAGRAM_API_BASE}${endpoint}`;
        
        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (method === 'POST' && body) {
            options.body = JSON.stringify({ access_token: accessToken, ...body });
        } else if (method === 'GET') {
            // For GET requests, add access_token as query parameter
            const urlWithToken = `${url}?access_token=${accessToken}`;
            return fetch(urlWithToken, options).then(res => res.json());
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`Instagram API request failed: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Get user's Instagram profile information
     */
    static async getUserProfile(userId: number): Promise<any> {
        const accessToken = await InstagramTokenService.getToken(userId);
        const accountId = await InstagramTokenService.getAccountId(userId);

        if (!accessToken) {
            throw new Error('No Instagram token found for user');
        }

        return this.makeInstagramAPIRequest('/user/profile', accessToken, 'POST', {
            user_id: accountId
        });
    }

    /**
     * Get user's Instagram media posts
     */
    static async getUserMedia(userId: number, limit: number = 25): Promise<any> {
        const accessToken = await InstagramTokenService.getToken(userId);
        const accountId = await InstagramTokenService.getAccountId(userId);

        if (!accessToken) {
            throw new Error('No Instagram token found for user');
        }

        return this.makeInstagramAPIRequest(`/user/media?limit=${limit}`, accessToken, 'POST', {
            user_id: accountId
        });
    }

    /**
     * Get insights for a specific media post
     */
    static async getMediaInsights(userId: number, mediaId: string): Promise<any> {
        console.log('🔍 INSTAGRAM SERVICE DEBUG - getMediaInsights called:', { userId, mediaId });
        
        const accessToken = await InstagramTokenService.getToken(userId);
        const accountId = await InstagramTokenService.getAccountId(userId);
        console.log('🔍 INSTAGRAM SERVICE DEBUG - Token/Account info:', {
            hasToken: !!accessToken,
            accountId,
            tokenLength: accessToken?.length || 0
        });

        if (!accessToken) {
            throw new Error('No Instagram token found for user');
        }

        const endpoint = `/media/${mediaId}/insights`;
        console.log('🔍 INSTAGRAM SERVICE DEBUG - Making API request to:', endpoint);
        
        const result = await this.makeInstagramAPIRequest(endpoint, accessToken, 'POST', {
            user_id: accountId
        });
        
        console.log('🔍 INSTAGRAM SERVICE DEBUG - API response received:', JSON.stringify(result, null, 2));
        return result;
    }

    /**
     * Get account-level insights
     */
    static async getAccountInsights(
        userId: number,
        period: string = 'day',
        since?: string,
        until?: string
    ): Promise<any> {
        const accessToken = await InstagramTokenService.getToken(userId);
        const accountId = await InstagramTokenService.getAccountId(userId);

        if (!accessToken) {
            throw new Error('No Instagram token found for user');
        }

        let endpoint = `/account/insights?period=${period}`;
        if (since) endpoint += `&since=${since}`;
        if (until) endpoint += `&until=${until}`;

        return this.makeInstagramAPIRequest(endpoint, accessToken, 'POST', {
            user_id: accountId
        });
    }

    /**
     * Get audience demographics
     */
    static async getAudienceInsights(userId: number, period: string = 'lifetime'): Promise<any> {
        console.log('🔍 INSTAGRAM SERVICE DEBUG - getAudienceInsights called:', { userId, period });
        
        const accessToken = await InstagramTokenService.getToken(userId);
        const accountId = await InstagramTokenService.getAccountId(userId);
        console.log('🔍 INSTAGRAM SERVICE DEBUG - Token/Account info:', {
            hasToken: !!accessToken,
            accountId,
            tokenLength: accessToken?.length || 0
        });

        if (!accessToken) {
            throw new Error('No Instagram token found for user');
        }

        const endpoint = `/audience/insights?period=${period}`;
        console.log('🔍 INSTAGRAM SERVICE DEBUG - Making API request to:', endpoint);
        
        const result = await this.makeInstagramAPIRequest(endpoint, accessToken, 'POST', {
            user_id: accountId
        });
        
        console.log('🔍 INSTAGRAM SERVICE DEBUG - API response received:', JSON.stringify(result, null, 2));
        return result;
    }

    /**
     * Collect daily snapshot (BASE 1 format)
     */
    static async collectDailySnapshot(userId: number): Promise<DailySnapshot> {
        const accessToken = await InstagramTokenService.getToken(userId);
        const accountId = await InstagramTokenService.getAccountId(userId);
        
        if (!accessToken || !accountId) {
            throw new Error('No Instagram token or account ID found for user');
        }

        // Get account insights for the last 2 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 2);

        const accountInsights = await this.getAccountInsights(
            userId,
            'day',
            startDate.toISOString().split('T')[0],
            endDate.toISOString().split('T')[0]
        );

        const audienceInsights = await this.getAudienceInsights(userId);

        // Process and format data according to BASE 1 structure
        const timeSeriesData: TimeSeriesData[] = [];
        const insights = accountInsights.insights?.data || [];

        // Extract reach and follower data from insights
        const reachData = insights.find((metric: any) => metric.name === 'reach');
        const followerData = insights.find((metric: any) => metric.name === 'follower_count');

        if (reachData?.values) {
            reachData.values.forEach((value: any, index: number) => {
                const date = new Date();
                date.setDate(date.getDate() - (reachData.values.length - 1 - index));
                
                timeSeriesData.push({
                    date: date.toISOString().split('T')[0],
                    reach: value.value || 0,
                    followerChange: 0 // Calculate from follower data if available
                });
            });
        }

        // Get latest daily summary
        const profileViewsData = insights.find((metric: any) => metric.name === 'profile_views');
        const accountsEngagedData = insights.find((metric: any) => metric.name === 'accounts_engaged');

        const latestDailySummary: DailySummary = {
            date: endDate.toISOString().split('T')[0],
            profileViews: profileViewsData?.values?.[profileViewsData.values.length - 1]?.value || 0,
            accountsEngaged: accountsEngagedData?.values?.[accountsEngagedData.values.length - 1]?.value || 0
        };

        // Process demographics
        const audienceData = audienceInsights.insights?.data || [];
        const demographicsData = audienceData.find((metric: any) => metric.name === 'follower_demographics');
        
        const lifetimeDemographics: Demographics = {
            genderAge: demographicsData?.values?.[0]?.value?.age || {},
            cities: demographicsData?.values?.[0]?.value?.country || {}
        };

        // Store in database
        await this.storeDailySnapshot(userId, {
            instagramAccountId: accountId,
            snapshotTimestamp: new Date().toISOString(),
            timeSeriesData,
            latestDailySummary,
            lifetimeDemographics
        });

        return {
            instagramAccountId: accountId,
            snapshotTimestamp: new Date().toISOString(),
            timeSeriesData,
            latestDailySummary,
            lifetimeDemographics
        };
    }

    /**
     * Store daily snapshot in database
     */
    private static async storeDailySnapshot(userId: number, snapshot: DailySnapshot): Promise<void> {
        const today = new Date().toISOString().split('T')[0];

        // Store daily snapshot
        await prisma.instagramDailySnapshot.upsert({
            where: {
                userId_instagramAccountId_snapshotDate: {
                    userId,
                    instagramAccountId: snapshot.instagramAccountId,
                    snapshotDate: new Date(today)
                }
            },
            update: {
                snapshotTimestamp: new Date(snapshot.snapshotTimestamp),
                reach: snapshot.latestDailySummary.profileViews,
                profileViews: snapshot.latestDailySummary.profileViews,
                accountsEngaged: snapshot.latestDailySummary.accountsEngaged
            },
            create: {
                userId,
                instagramAccountId: snapshot.instagramAccountId,
                snapshotDate: new Date(today),
                snapshotTimestamp: new Date(snapshot.snapshotTimestamp),
                reach: snapshot.latestDailySummary.profileViews,
                profileViews: snapshot.latestDailySummary.profileViews,
                accountsEngaged: snapshot.latestDailySummary.accountsEngaged
            }
        });

        // Store demographics
        await prisma.instagramDemographics.upsert({
            where: {
                userId_instagramAccountId: {
                    userId,
                    instagramAccountId: snapshot.instagramAccountId
                }
            },
            update: {
                genderAgeData: snapshot.lifetimeDemographics.genderAge,
                citiesData: snapshot.lifetimeDemographics.cities,
                lastUpdated: new Date()
            },
            create: {
                userId,
                instagramAccountId: snapshot.instagramAccountId,
                genderAgeData: snapshot.lifetimeDemographics.genderAge,
                citiesData: snapshot.lifetimeDemographics.cities,
                lastUpdated: new Date()
            }
        });
    }

    /**
     * Get time series data from database
     */
    static async getTimeSeriesData(userId: number, days: number = 30): Promise<TimeSeriesData[]> {
        console.log('🔍 INSTAGRAM SERVICE DEBUG - getTimeSeriesData called:', { userId, days });
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        console.log('🔍 INSTAGRAM SERVICE DEBUG - Querying database from:', startDate.toISOString());

        const snapshots = await prisma.instagramDailySnapshot.findMany({
            where: {
                userId,
                snapshotDate: {
                    gte: startDate
                }
            },
            orderBy: {
                snapshotDate: 'asc'
            }
        }) as any[];

        console.log('🔍 INSTAGRAM SERVICE DEBUG - Database snapshots found:', snapshots.length);
        if (snapshots.length > 0) {
            console.log('🔍 INSTAGRAM SERVICE DEBUG - Sample snapshot:', snapshots[0]);
        }

        const result = snapshots.map((snapshot: any) => ({
            date: snapshot.snapshotDate.toISOString().split('T')[0],
            reach: snapshot.reach || 0,
            followerChange: snapshot.followerChange || 0
        }));
        
        console.log('🔍 INSTAGRAM SERVICE DEBUG - Returning time series data:', result.length, 'points');
        return result;
    }

    /**
     * Get latest daily summary from database
     */
    static async getLatestDailySummary(userId: number): Promise<DailySummary | null> {
        const latestSnapshot = await prisma.instagramDailySnapshot.findFirst({
            where: { userId },
            orderBy: { snapshotDate: 'desc' }
        }) as any;

        if (!latestSnapshot) return null;

        return {
            date: latestSnapshot.snapshotDate.toISOString().split('T')[0],
            profileViews: latestSnapshot.profileViews || 0,
            accountsEngaged: latestSnapshot.accountsEngaged || 0
        };
    }

    /**
     * Get lifetime demographics from database
     */
    static async getLifetimeDemographics(userId: number): Promise<Demographics | null> {
        const demographics = await prisma.instagramDemographics.findFirst({
            where: { userId },
            orderBy: { lastUpdated: 'desc' }
        }) as any;

        if (!demographics) return null;

        return {
            genderAge: (demographics.genderAgeData as Record<string, number>) || {},
            cities: (demographics.citiesData as Record<string, number>) || {}
        };
    }
}
