import { IPollingClient, PollingData } from '../PollingClient';

export class InMemoryPollingClient implements IPollingClient {
    private storage: Map<string, boolean> = new Map();
    private expirationTime: number = 60000; // Expiration time in milliseconds -> 1 minute

    async connect(): Promise<void> {
        // No actual connection needed for in-memory storage.
        return Promise.resolve();
    }

    async disconnect(): Promise<void> {
        // No disconnection required.
        return Promise.resolve();
    }

    private buildKey({ userId, dataType }: PollingData): string {
        return `update:${userId}:${dataType}`;
    }

    async insertPollingData(data: PollingData): Promise<void> {
        const key = this.buildKey(data);
        this.storage.set(key, true);
        // Remove the data after the expiration time
        setTimeout(() => this.storage.delete(key), this.expirationTime);
    }

    async getPollingData(data: PollingData): Promise<boolean> {
        const key = this.buildKey(data);
        if (this.storage.has(key)) {
            this.storage.delete(key);
            return true;
        }
        return false;
    }
}
