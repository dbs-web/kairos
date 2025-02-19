import { RedisPollingClient } from './clients/RedisClient';

// Uncomment this for Mocking PollingClient
// import { InMemoryPollingClient } from "../pollingClient/InMemoryPollingClient";

const globalForPollingClient = global as typeof global & {
    pollingClient?: RedisPollingClient;
};

const pollingClient = globalForPollingClient.pollingClient || new RedisPollingClient();

if (!globalForPollingClient.pollingClient) {
    pollingClient.connect();
    globalForPollingClient.pollingClient = pollingClient;
}

export default pollingClient;
