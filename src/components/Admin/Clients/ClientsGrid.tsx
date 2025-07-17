import ClientCard from './ClientCard';
import { useClients } from '@/hooks/use-client';

export default function ClientsGrid() {
    const { users: clients } = useClients();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {clients && clients.map((client) => <ClientCard client={client} key={client.id} />)}
        </div>
    );
}

