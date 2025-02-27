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
            <DropdownMenuTrigger className="grid h-12 w-12 items-center rounded-full border border-border bg-gradient-to-r from-[hsl(191,65%,53%)] to-[#0085A3] text-white shadow-md transition-all duration-300 hover:scale-105">
                {name?.length > 0 ? name[0].toUpperCase() : ''}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
                <div className="p-2">
                    <span className="font-bold text-foreground">{email}</span>
                </div>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="text-foreground hover:bg-muted/50 cursor-pointer">Perfil</DropdownMenuItem>
                <DropdownMenuItem className="text-foreground hover:bg-muted/50 cursor-pointer">Uso</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="text-foreground hover:bg-muted/50 cursor-pointer">
                    <Link href="/logout">Sair</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}