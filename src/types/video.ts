export interface IVideo {
    id: number;
    title: string;
    text: string;
    legenda: string;
    url: string;
    width: number;
    height: number;
    heygenVideoId?: string;
    heygenStatus?: 'PROCESSING' | 'SUCCESS' | 'FAILED';
    heygenErrorMsg?: string;
    creationDate: string;
}
