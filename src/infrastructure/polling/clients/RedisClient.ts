import Redis from 'ioredis';
import { IPollingClient, PollingData } from '../PollingClient';

export class RedisPollingClient implements IPollingClient {
    private redis: Redis;
    private expirationTime: number = 60;

    constructor() {
        const host = process.env.REDIS_HOST ?? '';
        const password = process.env.REDIS_PASSWORD ?? '';
        const port = process.env.REDIS_PORT ?? '';

        if (!host || !password || !port) {
            throw new Error(
                'Redis configuration must be set in .env (REDIS_HOST, REDIS_PASSWORD, REDIS_PORT)',
            );
        }

        this.redis = new Redis({
            host,
            port: parseInt(port, 10),
            password,
            db: 0,
        });
    }

    async connect(): Promise<void> {
        if (!['reconnecting', 'connecting', 'connect', 'ready'].includes(this.redis.status)) {
            await this.redis.connect();
        }
    }

    async disconnect(): Promise<void> {
        await this.redis.disconnect();
    }

    private buildKey({ userId, dataType }: PollingData): string {
        return `update:${userId}:${dataType}`;
    }

    async insertPollingData(data: PollingData): Promise<void> {
        const key = this.buildKey(data);
        // Set the value "true" with an expiration time
        await this.redis.set(key, 'true', 'EX', this.expirationTime);
    }

    async getPollingData(data: PollingData): Promise<boolean> {
        const key = this.buildKey(data);
        const existingKey = await this.redis.get(key);

        if (existingKey) {
            await this.redis.del(key);
            return true;
        }

        return false;
    }

    // Add notification counter methods
    async incrementNotificationCount(userId: string, type: 'briefings' | 'videos'): Promise<void> {
        const key = `notifications:${userId}:${type}`;
        await this.redis.incr(key);
        await this.redis.expire(key, 86400); // 24h expiration
    }

    async getNotificationCount(userId: string, type: 'briefings' | 'videos'): Promise<number> {
        const key = `notifications:${userId}:${type}`;
        const count = await this.redis.get(key);
        return count ? parseInt(count, 10) : 0;
    }

    async clearNotificationCount(userId: string, type: 'briefings' | 'videos'): Promise<void> {
        const key = `notifications:${userId}:${type}`;
        await this.redis.del(key);
    }
}
