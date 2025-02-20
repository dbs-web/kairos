import DifyAdapter from '@/adapters/DifyAdapter';
import { IBriefing } from '@/domain/entities/briefing';
import { INews } from '@/domain/entities/news';
import { ISuggestion } from '@/domain/entities/suggestion';

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
    }

    private buildQuery({ data }: { data: INews | ISuggestion }) {
        let query = '';

        if ((data as ISuggestion).briefing !== undefined)
            query = `Faça um conteúdo sobre: ${data.title} | ${data.date}\n | ${(data as ISuggestion).briefing}`;
        else
            query = `Faça um conteúdo sobre: ${data.title} | ${data.date}\n ${(data as INews).summary}`;

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
