import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface NavUserMenuProps {
    name: string;
    email?: string;
}

export default function NavUserMenu({ name, email }: NavUserMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="grid h-12 w-12 items-center rounded-full border bg-primary text-white shadow-md transition-all duration-300 hover:scale-105">
                {name?.length > 0 ? name[0].toUpperCase() : ''}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <div className="p-2">
                    <span className="font-bold">{email}</span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Uso</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href="/logout">Sair</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
