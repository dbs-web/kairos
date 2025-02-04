import { useEffect } from 'react';
import Pagination from '../ui/pagination';
import BriefingCard from './BriefingCard';
import BriefingCardSkelleton from './BriefingCardSkelleton';

import { useBriefing } from '@/hooks/use-briefing';

export default function BriefingGrid() {
    const { briefings, page, totalPages, setPage, isLoading } = useBriefing();
    useEffect(() => console.log(isLoading), [isLoading]);
    return (
        <div className="flex h-full w-full flex-col items-center justify-between pb-[90px] transition-all duration-300">
            <div className="flex w-full flex-wrap items-center justify-start gap-y-8 !pt-0 lg:p-8">
                {briefings?.length > 0 &&
                    briefings.map((briefing) => {
                        if (['EM_ANALISE', 'EM_PRODUCAO'].includes(briefing.status))
                            return (
                                <div
                                    className="basis-1/1 h-full w-full lg:basis-1/2 2xl:basis-1/3"
                                    key={briefing.id}
                                >
                                    {isLoading && <BriefingCardSkelleton />}
                                    {!isLoading && <BriefingCard briefing={briefing} />}
                                </div>
                            );
                    })}
            </div>
            <div className="flex w-full flex-col items-center justify-center">
                <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            </div>
        </div>
    );
}
