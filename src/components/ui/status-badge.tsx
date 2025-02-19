import clsx from 'clsx';
import { Status } from '@/domain/entities/status';

enum ItemStatusLabel {
    EM_ANALISE = 'Em Análise',
    EM_PRODUCAO = 'Em produção',
    APROVADO = 'Aprovado',
    ARQUIVADO = 'Arquivado',
    PRODUZIDO = 'Produzido',
}

interface StatusBadgeProps {
    status: Status;
}

const badgeColor = {
    APROVADO: '#00aa00f0',
    ARQUIVADO: '#aa0000f0',
    EM_ANALISE: '#e5e5e5',
    EM_PRODUCAO: '#0085a3f0',
    PRODUZIDO: '#00aa00f0',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <div
            className={clsx('rounded p-2 text-xs font-medium', {
                'text-white': status !== 'EM_ANALISE',

                'text-[#333333]': status === 'EM_ANALISE',
                'bg-[#e5e5e5]': status === 'EM_ANALISE',

                'bg-[#00aa00f0]': status === 'APROVADO',
                'bg-[#aa0000f0]': status === 'ARQUIVADO',
                'bg-[#0085a3f0]': status === 'EM_PRODUCAO',
                'bg-[#00aa00f1]': status === 'PRODUZIDO',
            })}
        >
            {ItemStatusLabel[status]}
        </div>
    );
}
