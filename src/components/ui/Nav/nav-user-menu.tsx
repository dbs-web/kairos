import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useClients } from '@/hooks/use-client';

interface NavUserMenuProps {
    name: string;
    email?: string;
}

export default function NavUserMenu({ name, email }: NavUserMenuProps) {
    const { data: session } = useSession();
    const { logoutAllUsers } = useClients();

    const handleEmergencyLogoutAll = () => {
        if (confirm('EMERGÊNCIA: Desconectar todos os usuários?')) {
            logoutAllUsers();
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="grid h-12 w-12 items-center rounded-full border border-border bg-gradient-to-r from-[hsl(191,65%,53%)] to-[#0085A3] text-white shadow-md transition-all duration-300 hover:scale-105">
                {name?.length > 0 ? name[0].toUpperCase() : ''}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-border bg-card">
                <div className="p-2">
                    <span className="font-bold text-foreground">{email}</span>
                </div>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="cursor-pointer text-foreground hover:bg-muted/50">
                    Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-foreground hover:bg-muted/50">
                    Uso
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                {session?.user?.role === 'ADMIN' && (
                    <>
                        <DropdownMenuItem 
                            className="cursor-pointer text-red-600 hover:bg-red-50"
                            onClick={handleEmergencyLogoutAll}
                        >
                            🚨 Desconectar Todos
                        </DropdownMenuItem>
                    </>
                )}
                <DropdownMenuItem className="cursor-pointer text-foreground hover:bg-muted/50">
                    <Link href="/logout">Sair</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
