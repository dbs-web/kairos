import { useEffect } from 'react';
import Pagination from '../ui/pagination';
import BriefingCard from './BriefingCard';
import BriefingCardSkelleton from './BriefingCardSkelleton';

import { useBriefing } from '@/hooks/use-briefing';
import { Button } from '../ui/button';
import { MdOutlineCreateNewFolder } from 'react-icons/md';

export default function BriefingGrid() {
    const { briefings, page, totalPages, setPage, isLoading } = useBriefing();

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Espaço para adicionar filtros ou outras ações globais, se necessário */}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
                {isLoading &&
                    Array.from({ length: 6 }).map((_, index) => (
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
                    <div className="col-span-full flex flex-col items-center justify-center rounded-xl bg-card/50 py-16 text-center shadow-sm">
                        <p className="mb-4 text-lg text-foreground/80">
                            Nenhum briefing disponível para aprovação.
                        </p>
                        <Button className="flex gap-2 bg-gradient-to-r from-[#0085A3] to-primary text-primary-foreground shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30">
                            <MdOutlineCreateNewFolder className="text-lg" />
                            Criar novo briefing
                        </Button>
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
