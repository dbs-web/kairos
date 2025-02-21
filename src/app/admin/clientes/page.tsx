'use client';
import ClientsGrid from '@/components/Admin/Clients/ClientsGrid';
import { SearchDataProvider } from '@/hooks/use-search-data';

export default function Clientes() {
    return (
        <SearchDataProvider>
            <ClientsGrid />
        </SearchDataProvider>
    );
}
