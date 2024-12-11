export interface ISuggestion {
    _id: string;
    title: string;
    date: Date;
    briefing: string;
    user: string;
    status: 'em-analise' | 'em-producao' | 'aprovado' | 'arquivado';
}
