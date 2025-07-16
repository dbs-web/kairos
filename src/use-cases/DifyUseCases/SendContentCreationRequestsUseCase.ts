import DifyAdapter from '@/adapters/DifyAdapter';
import { IBriefing } from '@/domain/entities/briefing';
import { INews } from '@/domain/entities/news';
import { ISuggestion } from '@/domain/entities/suggestion';
import { UseCaseError } from '@/shared/errors';

export default class SendContentCreationRequestsUseCase {
    private difyAdapter: DifyAdapter;

    constructor(difyAdapter: DifyAdapter) {
        this.difyAdapter = difyAdapter;
    }

    async execute({
        difyAgentToken,
        dataArr,
        briefings,
    }: {
        difyAgentToken: string;
        dataArr: INews[] | ISuggestion[];
        briefings: IBriefing[];
    }) {
        try {
            const briefingMap = this.mapBriefingsToRefId({ briefings });

            const sendContentCreationRequests = dataArr.map(async (data) => {
                const briefing = briefingMap[data.id];

                if (briefing) {
                    await this.difyAdapter.sendContentCreationRequest({
                        briefingId: briefing.id,
                        query: this.buildQuery({ data }),
                        difyAgentToken,
                    });
                }
            });

            await Promise.all(sendContentCreationRequests);
        } catch (error) {
            throw new UseCaseError(
                'Error while fetching DiFy API on Content Creation Requests',
                error as Error,
            );
        }
    }

    private buildQuery({ data }: { data: INews | ISuggestion }) {
        let query = '';

        if ((data as ISuggestion).post_text !== undefined)
            query = `Faça um conteúdo sobre: ${(data as ISuggestion).post_text} | ${data.date}\n | ${(data as ISuggestion).name_profile}`;
        else
            query = `Faça um conteúdo sobre: ${(data as INews).title} | ${data.date}\n ${(data as INews).summary}`;

        return query;
    }

    private mapBriefingsToRefId({
        briefings,
    }: {
        briefings: IBriefing[];
    }): Record<number, IBriefing> {
        const briefingMap = briefings.reduce<Record<number, (typeof briefings)[0]>>(
            (acc, briefing) => {
                if (briefing.newsId) {
                    acc[briefing.newsId] = briefing;
                }

                if (briefing.suggestionId) {
                    acc[briefing.suggestionId] = briefing;
                }

                return acc;
            },
            {},
        );

        return briefingMap;
    }
}
