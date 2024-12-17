'use client';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useClients } from '@/hooks/use-client';

interface RemoveClientFormProps {
    userId: string;
    setModalOpen: (isOpen: boolean) => void;
}

export default function RemoveClientForm({ userId, setModalOpen }: RemoveClientFormProps) {
    const { deleteUser } = useClients();
    const { toast } = useToast();

    const handleRemove = async () => {
        deleteUser(userId);
        setModalOpen(false);
        toast({ title: 'Cliente removido com sucesso!' });
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
