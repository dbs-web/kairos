export type DataType = 'briefing' | 'video';

export interface PollingData {
    userId: number;
    dataType: DataType;
}

/**
 * Interface defining the operations for managing polling data,
 * including connect and disconnect methods.
 */
export interface IPollingClient {
    /**
     * Connects to the database or service.
     */
    connect(): Promise<void>;

    /**
     * Disconnects from the database or service.
     */
    disconnect(): Promise<void>;

    /**
     * Inserts or updates the polling status for the given userId and dataType.
     */
    insertPollingData(data: PollingData): Promise<void>;

    /**
     * Checks if polling data exists for the given combination.
     * If found, deletes it and returns true; otherwise returns false.
     */
    getPollingData(data: PollingData): Promise<boolean>;
}
