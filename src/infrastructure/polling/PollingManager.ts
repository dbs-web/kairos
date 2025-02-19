import pollingClient from './PollingClientSingleton';
import { PollingData } from './PollingClient';

export class PollingManager {
    private pollingClient = pollingClient;

    async connect(): Promise<void> {
        await this.pollingClient.connect();
    }

    async disconnect(): Promise<void> {
        await this.pollingClient.disconnect();
    }

    async insertData(data: PollingData): Promise<void> {
        await this.pollingClient.insertPollingData(data);
    }

    async getData(data: PollingData): Promise<boolean> {
        return await this.pollingClient.getPollingData(data);
    }
}
