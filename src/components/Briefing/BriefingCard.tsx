'use client';
import { IBriefing } from '@/types/briefing';
import AvatarList from './Avatar/AvatarList';

interface BriefingCardProps {
    briefing: IBriefing;
}

export default function BriefingCard({ briefing }: BriefingCardProps) {
    return (
        <div className="max-w-full space-y-4">
            <AvatarList />
        </div>
    );
}
