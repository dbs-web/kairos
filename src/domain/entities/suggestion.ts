import { Status } from './status';

export interface ISuggestion {
    id: number;
    post_url: string;
    user_photo: string | null;
    post_image: string | null;
    name_profile: string;
    post_text: string;
    socialmedia_name: string;
    date: Date;
    userId: number;
    status: Status;
}
