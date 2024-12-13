import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import BriefingCard from './BriefingCard';
import { useBriefing } from '@/hooks/use-briefing';

export default function BriefingGrid() {
    const { briefings } = useBriefing();

    return (
        <ScrollArea className="max-h-full">
            <div className="flex gap-x-4">
                {briefings?.length > 0 &&
                    briefings.map((briefing) => (
                        <BriefingCard briefing={briefing} key={briefing._id} />
                    ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
