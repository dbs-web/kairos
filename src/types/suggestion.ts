export interface ISuggestion {
    id: number;
    title: string;
    date: string;
    briefing: string;
    userId: number;
    status: 'EM_ANALISE' | 'EM_PRODUCAO' | 'APROVADO' | 'ARQUIVADO';
}
