import { ReactNode } from 'react';

interface NavLinkProps {
    Icon?: ReactNode;
    text: string;
    href: string;
    active?: boolean;
}

export default function NavLink({ Icon, text, href, active = false }: NavLinkProps) {
    return (
        <li
            className={`${
                active
                    ? 'border-primary bg-gradient-to-r from-[hsl(191,65%,53%)] to-[#0085A3] text-white shadow-md'
                    : 'text-foreground/70 hover:bg-muted/50 hover:text-primary'
            } flex flex-nowrap items-center justify-center gap-x-2.5 text-nowrap rounded-lg p-1.5 px-3.5 font-semibold transition-all duration-300`}
        >
            {Icon && (
                <span className="transition-transform duration-300 group-hover:scale-105">
                    {Icon}
                </span>
            )}
            <a href={href} className="text-base">
                {text}
            </a>
        </li>
    );
}