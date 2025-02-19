import { Status } from './status';

export interface ISuggestion {
    id: number;
    title: string;
    date: Date;
    briefing: string;
    userId: number;
    status: Status;
}
