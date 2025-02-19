'use client';
import LogTable from '@/components/Admin/Logs/LogTable';
import { SearchDataProvider } from '@/hooks/use-search-data';

export default function Logs() {
    return (
        <SearchDataProvider>
            <LogTable />
        </SearchDataProvider>
    );
}
