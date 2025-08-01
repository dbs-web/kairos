import crypto from 'crypto';
import db from '@/infrastructure/database/DatabaseFactory';

export interface InstagramTokenData {
    accessToken: string;
    instagramAccountId: string;
    expiresAt: Date;
}

export class InstagramTokenService {
    private static readonly ENCRYPTION_KEY = process.env.INSTAGRAM_TOKEN_ENCRYPTION_KEY || 'default-key-change-in-production';

    /**
     * Simple base64 encoding for token storage (for development)
     * In production, you should use proper encryption
     */
    private static encryptToken(token: string): string {
        // Simple base64 encoding with a basic XOR cipher
        const key = this.ENCRYPTION_KEY;
        let encrypted = '';

        for (let i = 0; i < token.length; i++) {
            const keyChar = key.charCodeAt(i % key.length);
            const tokenChar = token.charCodeAt(i);
            encrypted += String.fromCharCode(tokenChar ^ keyChar);
        }

        return Buffer.from(encrypted).toString('base64');
    }

    /**
     * Simple base64 decoding for token storage (for development)
     */
    private static decryptToken(encryptedToken: string): string {
        try {
            const encrypted = Buffer.from(encryptedToken, 'base64').toString();
            const key = this.ENCRYPTION_KEY;
            let decrypted = '';

            for (let i = 0; i < encrypted.length; i++) {
                const keyChar = key.charCodeAt(i % key.length);
                const encryptedChar = encrypted.charCodeAt(i);
                decrypted += String.fromCharCode(encryptedChar ^ keyChar);
            }

            return decrypted;
        } catch (error) {
            throw new Error('Failed to decrypt token');
        }
    }

    /**
     * Store Instagram access token for a user
     */
    static async storeToken(
        userId: number, 
        tokenData: InstagramTokenData
    ): Promise<void> {
        const encryptedToken = this.encryptToken(tokenData.accessToken);

        await db.upsert('userSocialToken', {
            where: {
                userId_platform: {
                    userId,
                    platform: 'INSTAGRAM'
                }
            },
            update: {
                accessToken: encryptedToken,
                instagramAccountId: tokenData.instagramAccountId,
                expiresAt: tokenData.expiresAt,
                updatedAt: new Date()
            },
            create: {
                userId,
                platform: 'INSTAGRAM',
                accessToken: encryptedToken,
                instagramAccountId: tokenData.instagramAccountId,
                expiresAt: tokenData.expiresAt
            }
        });
    }

    /**
     * Get Instagram access token for a user
     */
    static async getToken(userId: number): Promise<string | null> {
        const tokenRecord = await db.findFirst('userSocialToken', {
            where: {
                userId,
                platform: 'INSTAGRAM'
            }
        }) as any;

        if (!tokenRecord) {
            return null;
        }

        // Check if token is expired
        if (tokenRecord.expiresAt && new Date() > tokenRecord.expiresAt) {
            // Token expired, remove it
            await this.revokeToken(userId);
            return null;
        }

        return this.decryptToken(tokenRecord.accessToken);
    }

    /**
     * Get Instagram Business Account ID for a user
     */
    static async getAccountId(userId: number): Promise<string | null> {
        const tokenRecord = await db.findFirst('userSocialToken', {
            where: {
                userId,
                platform: 'INSTAGRAM'
            }
        }) as any;

        return tokenRecord?.instagramAccountId || null;
    }

    /**
     * Check if user has a valid Instagram token
     */
    static async hasValidToken(userId: number): Promise<boolean> {
        const token = await this.getToken(userId);
        return token !== null;
    }

    /**
     * Get token expiration date
     */
    static async getTokenExpiration(userId: number): Promise<Date | null> {
        const tokenRecord = await db.findFirst('userSocialToken', {
            where: {
                userId,
                platform: 'INSTAGRAM'
            }
        }) as any;

        return tokenRecord?.expiresAt || null;
    }

    /**
     * Revoke Instagram token for a user
     */
    static async revokeToken(userId: number): Promise<void> {
        await db.deleteMany('userSocialToken', {
            where: {
                userId,
                platform: 'INSTAGRAM'
            }
        });
    }

    /**
     * Get all users with Instagram tokens (for admin purposes)
     */
    static async getAllConnectedUsers(): Promise<Array<{
        userId: number;
        userName: string;
        userEmail: string;
        instagramAccountId: string | null;
        expiresAt: Date | null;
        createdAt: Date;
    }>> {
        const tokens = await db.findMany('userSocialToken', {
            where: {
                platform: 'INSTAGRAM'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        }) as any[];

        return tokens.map((token: any) => ({
            userId: token.userId,
            userName: token.user.name,
            userEmail: token.user.email,
            instagramAccountId: token.instagramAccountId,
            expiresAt: token.expiresAt,
            createdAt: token.createdAt
        }));
    }

    /**
     * Get tokens that will expire soon (for proactive refresh)
     */
    static async getExpiringTokens(daysBeforeExpiry: number = 7): Promise<Array<{
        userId: number;
        expiresAt: Date;
    }>> {
        const expiryThreshold = new Date();
        expiryThreshold.setDate(expiryThreshold.getDate() + daysBeforeExpiry);

        const tokens = await db.findMany('userSocialToken', {
            where: {
                platform: 'INSTAGRAM',
                expiresAt: {
                    lte: expiryThreshold,
                    gt: new Date() // Not already expired
                }
            },
            select: {
                userId: true,
                expiresAt: true
            }
        }) as any[];

        return tokens.map((token: any) => ({
            userId: token.userId,
            expiresAt: token.expiresAt!
        }));
    }

    /**
     * Refresh Instagram token (placeholder for future implementation)
     * Instagram Business API tokens are long-lived (60 days) and don't have refresh tokens
     */
    static async refreshToken(userId: number): Promise<string | null> {
        // Instagram Business API doesn't support token refresh
        // Tokens are long-lived (60 days) and users need to re-authenticate
        // This method is here for future compatibility if Instagram adds refresh tokens
        
        console.warn(`Instagram token refresh requested for user ${userId}, but Instagram Business API doesn't support token refresh. User needs to re-authenticate.`);
        return null;
    }
}
