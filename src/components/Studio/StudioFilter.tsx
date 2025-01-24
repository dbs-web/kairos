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
                        <SelectTrigger className="gap-x-1.5 rounded-lg border-none bg-muted/25 !text-[#475467a0] outline-none focus:border-transparent focus:ring-0 active:ring-0">
                            <VscSettings className="!text-xs md:text-lg" />
                            <SelectValue placeholder="Filtrar" />
                        </SelectTrigger>
                        <SelectContent>
                            {statuses?.map((status, index) => (
                                <SelectItem
                                    className="cursor-pointer"
                                    value={status.value}
                                    key={`status-${index}`}
                                >
                                    {status.label}
                                </SelectItem>
                            ))}
                            {selectedStatus && (
                                <>
                                    <SelectSeparator />
                                    <button
                                        className="w-full px-2 py-1 text-start text-sm hover:bg-muted/10"
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
            <div className="ms-auto flex w-full max-w-xs items-center justify-start gap-x-1.5 rounded-lg bg-muted/25 p-2 py-2 text-[#475467] md:px-4">
                <BiSearch className="min-w-3 text-sm text-[#475467a0]" />
                <input
                    type="text"
                    className="md:text-md border-none bg-transparent text-xs outline-none focus:border-transparent focus:ring-0 active:ring-0"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    );
}
