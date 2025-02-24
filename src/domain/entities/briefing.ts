import { Status } from './status';

export interface IBriefing {
    id: number;
    suggestionId?: number | null;
    newsId?: number | null;
    title: string;
    text?: string | null | undefined;
    date?: Date;
    status: Status;
    userId: number;
    sources?: string | null;
}

export interface IAvatar {
    avatar_id: string;
    avatar_name: string;
    preview_image_url: string;
    preview_video_url: string;
}
