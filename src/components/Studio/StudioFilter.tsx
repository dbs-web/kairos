'use client';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useSearchData } from '@/hooks/use-search-data';
import { BiSearch } from 'react-icons/bi';
import { VscSettings } from 'react-icons/vsc';

export default function StudioFilter() {
    const { searchTerm, setSearchTerm, selectedStatus, setSelectedStatus, statuses } =
        useSearchData();

    return (
        <div className="flex w-full items-center justify-center gap-x-2 overflow-hidden px-0 lg:w-1/3 lg:px-0 2xl:w-1/4">
            {statuses?.length > 0 && (
                <div>
                    <Select onValueChange={setSelectedStatus} value={selectedStatus}>
                        <SelectTrigger className="gap-x-1.5 rounded-lg border-none bg-muted/50 !text-foreground/70 outline-none focus:border-transparent focus:ring-0 active:ring-0">
                            <VscSettings className="!text-xs text-foreground/70 md:text-lg" />
                            <SelectValue placeholder="Filtrar" />
                        </SelectTrigger>
                        <SelectContent className="border-border bg-card">
                            {statuses?.map((status, index) => (
                                <SelectItem
                                    className="cursor-pointer text-foreground"
                                    value={status.value}
                                    key={`status-${index}`}
                                >
                                    {status.label}
                                </SelectItem>
                            ))}
                            {selectedStatus && (
                                <>
                                    <SelectSeparator className="bg-border" />
                                    <button
                                        className="w-full px-2 py-1 text-start text-sm text-foreground hover:bg-muted/50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedStatus('');
                                        }}
                                    >
                                        Limpar
                                    </button>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            )}
            <div className="ms-auto flex w-full max-w-xs items-center justify-start gap-x-1.5 rounded-lg bg-muted/50 p-2 py-2 text-foreground/70 md:px-4">
                <BiSearch className="min-w-3 text-sm text-foreground/50" />
                <input
                    type="text"
                    className="md:text-md border-none bg-transparent text-xs text-foreground outline-none placeholder:text-foreground/50 focus:border-transparent focus:ring-0 active:ring-0"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    );
}
