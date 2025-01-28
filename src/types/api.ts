export interface IApiLog {
    id: number;
    route: string;
    body: string;
    error?: string;
    responseCode?: number;
    time: string;
}
