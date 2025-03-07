import { useEffect } from 'react';
import Pagination from '../ui/pagination';
import BriefingCard from './BriefingCard';
import BriefingCardSkelleton from './BriefingCardSkelleton';

import { useBriefing } from '@/hooks/use-briefing';
import { Button } from '../ui/button';

export default function BriefingGrid() {
    const { briefings, page, totalPages, setPage, isLoading } = useBriefing();

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
                {isLoading &&
                    Array.from({ length: 3 }).map((_, index) => (
                        <BriefingCardSkelleton key={`skelleton-${index}`} />
                    ))}

                {!isLoading &&
                    briefings?.length > 0 &&
                    briefings.map((briefing) => {
                        if (['EM_ANALISE', 'EM_PRODUCAO'].includes(briefing.status)) {
                            return <BriefingCard key={briefing.id} briefing={briefing} />;
                        }
                        return null;
                    })}

                {!isLoading && (!briefings || briefings.length === 0) && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                        <p className="mb-4 text-lg text-neutral-600">
                            Nenhum briefing disponível para aprovação.
                        </p>
                        <Button>Criar novo briefing</Button>
                    </div>
                )}
            </div>

            {briefings && briefings.length > 0 && (
                <div className="mt-8 flex justify-center">
                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                </div>
            )}
        </div>
    );
}
