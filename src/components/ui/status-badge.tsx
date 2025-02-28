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

export default function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <div
            className={clsx('rounded-md px-2.5 py-1 text-xs font-medium', {
                // Dark theme variants using CSS variables from globals.css
                'bg-primary/20 text-primary': status === 'EM_ANALISE',
                'bg-secondary/20 text-secondary': status === 'EM_PRODUCAO',
                'bg-chart-4/20 text-chart-4': status === 'APROVADO' || status === 'PRODUZIDO',
                'bg-destructive/20 text-destructive': status === 'ARQUIVADO',
            })}
        >
            {ItemStatusLabel[status]}
        </div>
    );
}
