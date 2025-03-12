import { ISuggestion } from '@/domain/entities/suggestion';
import { IBriefingService } from '../../services/BriefingService';
import { DifyStatus, IBriefing } from '@/domain/entities/briefing';
import { Status } from '@/domain/entities/status';
import { INews } from '@/domain/entities/news';

import { UseCaseError } from '@/shared/errors';

export default class CreateBriefingsUseCase {
    private briefingService: IBriefingService;

    constructor(briefingService: IBriefingService) {
        this.briefingService = briefingService;
    }

    async fromSuggestions({
        suggestionsData,
        userId,
    }: {
        suggestionsData: Omit<ISuggestion, 'briefing'>[];
        userId: number;
    }): Promise<IBriefing[]> {
        const briefingsToCreate: Omit<IBriefing, 'id'>[] = suggestionsData.map((suggestion) => ({
            title: suggestion.title,
            date: new Date(),
            suggestionId: suggestion.id,
            status: Status.EM_PRODUCAO,
            difyStatus: DifyStatus.EM_PRODUCAO,
            userId: userId,
        }));

        return await this.briefingService.createMany(briefingsToCreate);
    }

    async fromNews({
        newsData,
        userId,
    }: {
        newsData: INews[];
        userId: number;
    }): Promise<IBriefing[]> {
        const briefingsToCreate: Omit<IBriefing, 'id'>[] = newsData.map((news) => ({
            title: news.title,
            date: new Date(),
            newsId: news.id,
            status: Status.EM_PRODUCAO,
            difyStatus: DifyStatus.EM_PRODUCAO,
            userId: userId,
        }));

        return await this.briefingService.createMany(briefingsToCreate);
    }

    /** Create briefing from prompt
     * @param title Briefing title
     * @param userId User ID
     *
     * @returns Created briefing
     * @throws UseCaseError if failed to create briefing
     */
    async fromPrompt({ title, userId }: { title: string; userId: number }): Promise<IBriefing> {
        const createdBriefing = await this.briefingService.create({
            title,
            date: new Date(),
            userId,
            status: Status.EM_PRODUCAO,
            difyStatus: DifyStatus.EM_PRODUCAO,
        });

        if (!createdBriefing) {
            throw new UseCaseError('Failed to create briefing');
        }

        return createdBriefing;
    }
}
