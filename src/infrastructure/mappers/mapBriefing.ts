import { Briefing as PrismaBriefing, DifyStatus as PrismaDifyStatus } from '@prisma/client';
import { DifyStatus, IBriefing } from '@/domain/entities/briefing';
import { mapStatus } from './mapStatus';

export function mapBriefing(prismaBriefing: PrismaBriefing): IBriefing {
    const {
        id,
        suggestionId,
        newsId,
        title,
        text,
        date,
        status,
        difyStatus,
        difyMessage,
        userId,
        sources,
    } = prismaBriefing;

    const mapDifyStatus = (difyStatus: PrismaDifyStatus): DifyStatus => {
        switch (difyStatus) {
            case PrismaDifyStatus.ERROR:
                return DifyStatus.ERROR;
            case PrismaDifyStatus.EM_PRODUCAO:
                return DifyStatus.EM_PRODUCAO;
            case PrismaDifyStatus.PRONTO:
                return DifyStatus.PRONTO;
            default:
                throw new Error(`Dify Status desconhecido: ${difyStatus}`);
        }
    };

    return {
        id,
        suggestionId,
        newsId,
        title,
        text,
        date,
        difyStatus: mapDifyStatus(difyStatus),
        difyMessage: difyMessage,
        status: mapStatus(status),
        userId,
        sources,
    };
}
