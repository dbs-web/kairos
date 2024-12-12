import BriefingCard from './BriefingCard';
import { useBriefing } from '@/hooks/use-briefing';

export default function BriefingGrid() {
    const { briefings } = useBriefing();
    return (
        <div className="grid h-full grid-cols-4 px-12 pb-12">
            {briefings?.length > 0 &&
                briefings.map((briefing) => (
                    <BriefingCard briefing={briefing} key={briefing._id} />
                ))}
        </div>
    );
}
