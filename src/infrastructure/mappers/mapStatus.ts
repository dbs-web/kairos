import { Status as PrismaStatus } from '@prisma/client';
import { Status } from '@/domain/entities/status';

export function mapStatus(prismaStatus: PrismaStatus): Status {
    switch (prismaStatus) {
        case PrismaStatus.EM_ANALISE:
            return Status.EM_ANALISE;
        case PrismaStatus.EM_PRODUCAO:
            return Status.EM_PRODUCAO;
        case PrismaStatus.APROVADO:
            return Status.APROVADO;
        case PrismaStatus.ARQUIVADO:
            return Status.ARQUIVADO;
        case PrismaStatus.PRODUZIDO:
            return Status.PRODUZIDO;
        default:
            throw new Error(`Status desconhecido: ${prismaStatus}`);
    }
}
