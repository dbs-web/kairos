import pollingClient from './PollingClientSingleton';
import { IPollingClient, PollingData } from './PollingClient';

export class PollingManager implements IPollingClient {
    private pollingClient = pollingClient;

    async connect(): Promise<void> {
        await this.pollingClient.connect();
    }

    async disconnect(): Promise<void> {
        await this.pollingClient.disconnect();
    }

    async insertPollingData(data: PollingData): Promise<void> {
        await this.pollingClient.insertPollingData(data);
    }

    async getPollingData(data: PollingData): Promise<boolean> {
        return await this.pollingClient.getPollingData(data);
    }
}
