import { IUser } from '@/types/user';
import { FiEdit, FiTrash2, FiClipboard } from 'react-icons/fi';
import { useState } from 'react';
import EditClientDialog from './EditClientDialog';
import RemoveClientDialog from './RemoveClientDialog';
import ClickableIcon from './ClickableIcon';

interface ClientCardProps {
    client: IUser;
}

export default function ClientCard({ client }: ClientCardProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [removeOpen, setRemoveOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(false);

    const handleCopyToClipboard = async () => {
        navigator.clipboard.writeText(String(client.id));
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    return (
        <div className="group relative cursor-pointer rounded-lg border bg-white p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center justify-center gap-x-2">
                    <div className="h-12 w-12 rounded-lg bg-primary" />
                    <div className="flex flex-col items-start">
                        <h3 className="text-center font-medium text-neutral-700">{client.name}</h3>
                        <span className="text-sm text-neutral-500">{client.email}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div
                        className="-mb-2 p-0"
                        onMouseEnter={() => setOpen(true)}
                        onMouseLeave={() => setOpen(false)}
                    >
                        <ClickableIcon
                            onClick={handleCopyToClipboard}
                            label={
                                copied
                                    ? 'ID do usuário copiado com sucesso.'
                                    : 'Copiar ID do Usuário'
                            }
                            open={open}
                        >
                            <FiClipboard size={20} />
                        </ClickableIcon>
                    </div>

                    <ClickableIcon onClick={() => setEditOpen(true)} label="Editar cliente">
                        <FiEdit size={20} />
                    </ClickableIcon>
                    <ClickableIcon onClick={() => setRemoveOpen(true)} label="Remover Cliente">
                        <FiTrash2 size={20} />
                    </ClickableIcon>
                </div>
            </div>

            {editOpen && <EditClientDialog client={client} open={editOpen} setOpen={setEditOpen} />}
            {removeOpen && (
                <RemoveClientDialog client={client} open={removeOpen} setOpen={setRemoveOpen} />
            )}
        </div>
    );
}
