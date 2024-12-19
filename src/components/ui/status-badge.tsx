import { Status } from '@/types/status';

enum ItemStatusLabel {
    EM_ANALISE = 'Em Análise',
    EM_PRODUCAO = 'Em produção',
    APROVADO = 'Aprovado',
    ARQUIVADO = 'Arquivado',
}

interface StatusBadgeProps {
    status: Status;
}

const badgeColor = {
    APROVADO: '#00aa00f0',
    ARQUIVADO: '#aa0000f0',
    EM_ANALISE: '#e5e5e5',
    EM_PRODUCAO: '#0085a3f0',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <div
            className="rounded p-2 text-xs font-medium"
            style={{
                backgroundColor: badgeColor[status],
                color: status === 'EM_ANALISE' ? '#939393' : '#fff',
            }}
        >
            {ItemStatusLabel[status]}
        </div>
    );
}
