import { useDataFilter } from '@/hooks/use-data-filter';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import BriefingCard from './BriefingCard';
import { useBriefing } from '@/hooks/use-briefing';
import { useEffect } from 'react';
import { Status } from '@/types/status';

export default function BriefingGrid() {
    const { briefings } = useBriefing();
    const { filteredData, setInitialData } = useDataFilter();

    useEffect(() => {
        setInitialData(briefings);
    }, [briefings]);

    return (
        <ScrollArea className="max-h-full">
            <div className="flex flex-wrap gap-y-8 p-8 !pt-0">
                {filteredData?.length > 0 &&
                    filteredData.map((briefing) => {
                        if (["EM_ANALISE", "PRODUZIDO"].includes(briefing.status))
                            return (
                                <div className="basis-1/4" key={briefing.id}>
                                    <BriefingCard briefing={briefing} />
                                </div>
                            );
                    })}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
