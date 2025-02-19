import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IUser } from '@/domain/entities/user';
import EditClientForm from './forms/EditClientForm';

interface EditClientDialogProps {
    client: IUser;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function EditClientDialog({ client, open, setOpen }: EditClientDialogProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Cliente</DialogTitle>
                </DialogHeader>
                <EditClientForm client={client} setModalOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}
