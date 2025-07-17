'use client';
import { ILink } from '@/domain/link';
import ClientRegisterDialog from './ClientRegisterDialog';
import NavLinks from '@/components/ui/Nav/nav-links';
import { CiCircleList } from 'react-icons/ci';
import { Button } from '@/components/ui/button';
import { useClients } from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';

const clientsLinks: ILink[] = [
    {
        Icon: <CiCircleList className="mb-1 text-xl" />,
        text: 'Ver Clientes',
        href: '/admin/clientes',
    },
];

export default function ClientTools() {
    const { logoutAllUsers } = useClients();
    const { toast } = useToast();

    const handleLogoutAll = () => {
        if (confirm('Tem certeza que deseja desconectar TODOS os usuários?')) {
            logoutAllUsers(undefined, {
                onSuccess: () => {
                    toast({ title: 'Todos os usuários foram desconectados!' });
                }
            });
        }
    };

    return (
        <div className="flex w-full items-center justify-between">
            <NavLinks links={clientsLinks} type="secondary" />

            <div className="flex items-center justify-center gap-x-4">
                <Button onClick={handleLogoutAll} variant="destructive">
                    Desconectar Todos
                </Button>
                <ClientRegisterDialog />
            </div>
        </div>
    );
}

