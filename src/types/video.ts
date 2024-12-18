export interface IVideo {
    id: number;
    title: string;
    legenda: string;
    url: string;
    heygenVideoId?: string;
    heygenStatus?: 'PROCESSING' | 'SUCCESS' | 'FAILED';
    heygenErrorMsg?: string;
}
