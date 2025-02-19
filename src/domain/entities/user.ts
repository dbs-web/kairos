import { IBriefing } from './briefing';
import { ISuggestion } from './suggestion';
import { IVideo } from './video';

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    avatarGroupId?: string;
    voiceId?: string;
    difyAgent?: string;
    difyContentCreation?: string;
    role: UserRoles;
    briefings?: IBriefing[];
    videos?: IVideo[];
    suggestions?: ISuggestion[];
}

export enum UserRoles {
    ADMIN = 'ADMIN',
    USER = 'USER',
}
