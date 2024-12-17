import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IUser } from '@/types/user';
import RemoveClientForm from './forms/RemoveClientForm';

interface RemoveClientDialogProps {
    client: IUser;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function RemoveClientDialog({ client, open, setOpen }: RemoveClientDialogProps) {
    if (!client.id) return;
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remover Cliente</DialogTitle>
                </DialogHeader>
                <RemoveClientForm userId={client.id} setModalOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}
