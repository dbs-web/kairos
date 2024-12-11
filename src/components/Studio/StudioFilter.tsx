import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { BiSearch } from 'react-icons/bi';
import { VscSettings } from 'react-icons/vsc';

export default function Filter() {
    return (
        <div className="flex items-center justify-center gap-x-2">
            <div>
                <Select>
                    <SelectTrigger className="max-w-32 gap-x-1.5 rounded-lg border-none bg-muted/25 !text-[#475467a0] outline-none focus:border-transparent focus:ring-0 active:ring-0">
                        <VscSettings className="text-lg" />
                        <SelectValue placeholder="Filtrar" />
                    </SelectTrigger>
                    <SelectContent></SelectContent>
                </Select>
            </div>
            <div className="flex min-w-48 items-center justify-center gap-x-1.5 rounded-lg bg-muted/25 px-4 py-2 text-[#475467]">
                <BiSearch className="text-lg text-[#475467a0]" />
                <input
                    type="text"
                    className="border-none bg-transparent outline-none focus:border-transparent focus:ring-0 active:ring-0"
                    placeholder="Buscar..."
                />
            </div>
        </div>
    );
}
