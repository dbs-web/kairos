import { Status } from './status';

export interface IBriefing {
    id: number;
    suggestion: string;
    title: string;
    date: Date;
    text: string;
    status: Status;
    user: string;
}

export interface IAvatar {
    avatar_id: string;
    avatar_name: string;
    preview_image_url: string;
    preview_video_url: string;
}
