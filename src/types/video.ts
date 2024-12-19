export interface IVideo {
    id: number;
    title: string;
    legenda: string;
    url: string;
    width: number;
    height: number;
    heygenVideoId?: string;
    heygenStatus?: 'PROCESSING' | 'SUCCESS' | 'FAILED';
    heygenErrorMsg?: string;
}
