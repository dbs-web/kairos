import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import BriefingCard from './BriefingCard';
import { useBriefing } from '@/hooks/use-briefing';

export default function BriefingGrid() {
    const { briefings } = useBriefing();

    return (
        <ScrollArea className="max-h-full">
            <div className="flex flex-wrap gap-y-8 p-8 !pt-0">
                {briefings?.length > 0 &&
                    briefings.map((briefing) => (
                        <div className="basis-1/4" key={briefing.id}>
                            <BriefingCard briefing={briefing} />
                        </div>
                    ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
