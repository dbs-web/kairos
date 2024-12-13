export interface ISuggestion {
    _id: string;
    title: string;
    date: string;
    briefing: string;
    user: string;
    status: 'em-analise' | 'em-producao' | 'aprovado' | 'arquivado';
}
