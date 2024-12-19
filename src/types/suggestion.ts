import { Status } from './status';

export interface ISuggestion {
    id: number;
    title: string;
    date: string;
    briefing: string;
    userId: number;
    status: Status;
}
