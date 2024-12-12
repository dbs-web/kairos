export interface IBriefing {
    _id: string;
    suggestion: string;
    title: string;
    date: Date;
    text: string;
    status: 'em-analise' | 'em-producao' | 'aprovado' | 'arquivado';
    user: string;
}

export interface IAvatar {
    avatar_id: string;
    avatar_name: string;
    preview_image_url: string;
}
