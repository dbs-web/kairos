'use client';
import { useState } from 'react';
import { useClients } from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';
import ClientsGrid from '@/components/Admin/Clients/ClientsGrid';

export default function ClientsPage() {
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const { logoutUsers, logoutAllUsers } = useClients();
    const { toast } = useToast();

    const handleLogoutSelected = () => {
        if (selectedUsers.length === 0) {
            toast({ title: 'Selecione pelo menos um usuário', variant: 'destructive' });
            return;
        }
        
        logoutUsers(selectedUsers, {
            onSuccess: () => {
                toast({ title: `${selectedUsers.length} usuário(s) desconectado(s)!` });
                setSelectedUsers([]);
            }
        });
    };

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
        <div className="space-y-4">
            <ClientsGrid />
        </div>
    );
}



