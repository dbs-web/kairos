'use client';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDataFilter } from '@/hooks/use-data-filter';
import { BiSearch } from 'react-icons/bi';
import { VscSettings } from 'react-icons/vsc';

export default function Filter() {
    const { searchText, setSearchText, setSelectedStatus, selectedStatus, statuses } =
        useDataFilter();

    return (
        <div className="flex items-center justify-center gap-x-2">
            <div>
                <Select onValueChange={setSelectedStatus} value={selectedStatus}>
                    <SelectTrigger className="max-w-32 gap-x-1.5 rounded-lg border-none bg-muted/25 !text-[#475467a0] outline-none focus:border-transparent focus:ring-0 active:ring-0">
                        <VscSettings className="text-lg" />
                        <SelectValue placeholder="Filtrar" />
                    </SelectTrigger>
                    <SelectContent>
                        {statuses?.length > 0 &&
                            statuses.map((status, index) => (
                                <SelectItem
                                    className="cursor-pointer"
                                    value={status.value}
                                    key={`status-${index}`}
                                >
                                    {status.label}
                                </SelectItem>
                            ))}
                        {selectedStatus?.length > 0 && (
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
            <div className="flex min-w-48 items-center justify-center gap-x-1.5 rounded-lg bg-muted/25 px-4 py-2 text-[#475467]">
                <BiSearch className="text-lg text-[#475467a0]" />
                <input
                    type="text"
                    className="border-none bg-transparent outline-none focus:border-transparent focus:ring-0 active:ring-0"
                    placeholder="Buscar..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
        </div>
    );
}
