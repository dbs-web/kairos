import { Status } from './status';

export interface INews {
    id: number;
    title: string;
    text: string;
    url: string;
    summary: string;
    thumbnail: string;
    date: Date;
    status: Status;
    userId: number;
}
