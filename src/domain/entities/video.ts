export interface IVideo {
    id: number;
    userId: number;
    title: string;
    transcription?: string;
    legenda?: string;
    url?: string;
    width: number;
    height: number;
    heygenVideoId?: string;
    heygenStatus?: HeyGenStatus;
    heygenErrorMsg?: string;
    creationDate?: Date;
}

export enum HeyGenStatus {
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

export enum HeyGenAvatarVideoStatus {
    SUCCESS = 'avatar_video.success',
    FAIL = 'avatar_video.fail',
}
