export interface IApiLog {
    id: number;
    route: string;
    body: {};
    error?: string;
    responseCode: number;
    time: Date;
}
