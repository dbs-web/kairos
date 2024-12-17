import ClientCard from './ClientCard';
import { useClients } from '@/hooks/use-client';

export default function ClientsGrid() {
    const { users: clients } = useClients('role', 'USER');

    return (
        <div className="grid grid-cols-4 grid-rows-4 gap-4">
            {clients && clients.map((client) => <ClientCard client={client} key={client.id} />)}
        </div>
    );
}
