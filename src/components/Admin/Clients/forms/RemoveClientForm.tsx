'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useClients } from '@/hooks/use-client';

interface RemoveClientFormProps {
    userId: string;
    setModalOpen: (isOpen: boolean) => void;
}

export default function RemoveClientForm({ userId, setModalOpen }: RemoveClientFormProps) {
    const { deleteUser } = useClients();

    const handleRemove = async () => {
        deleteUser(userId);
        setModalOpen(false);
        toast('Cliente removido com sucesso!');
    };

    return (
        <div className="space-y-4">
            <p>Tem certeza que deseja remover este cliente?</p>
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                    Cancelar
                </Button>
                <Button variant="destructive" onClick={handleRemove}>
                    Remover
                </Button>
            </div>
        </div>
    );
}
