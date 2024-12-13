import { IUser } from '@/types/user';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';
import EditClientDialog from './EditClientDialog';
import RemoveClientDialog from './RemoveClientDialog';

interface ClientCardProps {
    client: IUser;
}

export default function ClientCard({ client }: ClientCardProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [removeOpen, setRemoveOpen] = useState(false);

    return (
        <div className="relative cursor-pointer rounded-lg border bg-white p-5 transition-all duration-300 hover:scale-105 hover:shadow-md">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center justify-center gap-x-2">
                    <div className="h-12 w-12 rounded-lg bg-primary" />
                    <div className="flex flex-col items-start">
                        <h3 className="text-center font-medium text-neutral-700">{client.name}</h3>
                        <span className="text-sm text-neutral-500">{client.email}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setEditOpen(true)}
                        aria-label="Editar cliente"
                    >
                        <FiEdit size={20} />
                    </button>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setRemoveOpen(true)}
                        aria-label="Remover cliente"
                    >
                        <FiTrash2 size={20} />
                    </button>
                </div>
            </div>

            {editOpen && <EditClientDialog client={client} open={editOpen} setOpen={setEditOpen} />}
            {removeOpen && (
                <RemoveClientDialog client={client} open={removeOpen} setOpen={setRemoveOpen} />
            )}
        </div>
    );
}
