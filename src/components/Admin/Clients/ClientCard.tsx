import { IUser } from '@/domain/entities/user';
import { FiEdit, FiTrash2, FiClipboard, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';
import EditClientDialog from './EditClientDialog';
import RemoveClientDialog from './RemoveClientDialog';
import ClickableIcon from './ClickableIcon';
import { useClients } from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';

interface ClientCardProps {
    client: IUser;
}

export default function ClientCard({ client }: ClientCardProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [removeOpen, setRemoveOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const { logoutUsers } = useClients();
    const { toast } = useToast();

    const handleLogoutUser = () => {
        logoutUsers([client.id], {
            onSuccess: () => {
                toast({ 
                    title: 'Usuário desconectado com sucesso!',
                    description: `${client.name} será desconectado na próxima requisição.`
                });
            },
            onError: () => {
                toast({ 
                    title: 'Erro ao desconectar usuário',
                    variant: 'destructive'
                });
            }
        });
    };

    const handleCopyToClipboard = async () => {
        navigator.clipboard.writeText(String(client.id));
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    return (
        <div className="group relative cursor-pointer rounded-lg border bg-white p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col space-y-4">
                {/* Client info section */}
                <div className="flex items-center gap-x-2">
                    <div className="h-12 w-12 rounded-lg bg-primary" />
                    <div className="flex flex-col items-start">
                        <h3 className="text-center font-medium text-neutral-700">{client.name}</h3>
                        <span className="text-sm text-neutral-500">{client.email}</span>
                    </div>
                </div>
                
                {/* Action buttons section */}
                <div className="flex justify-end gap-2">
                    <div
                        className="p-0"
                        onMouseEnter={() => setTooltipOpen(true)}
                        onMouseLeave={() => setTooltipOpen(false)}
                    >
                        <ClickableIcon
                            onClick={handleCopyToClipboard}
                            label={
                                copied
                                    ? 'ID do usuário copiado com sucesso.'
                                    : 'Copiar ID do Usuário'
                            }
                            open={tooltipOpen}
                        >
                            <FiClipboard size={20} />
                        </ClickableIcon>
                    </div>

                    <ClickableIcon onClick={handleLogoutUser} label="Desconectar usuário">
                        <FiLogOut size={20} />
                    </ClickableIcon>
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




