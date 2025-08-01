import { ReactNode } from 'react';

interface NavLinkProps {
    Icon?: ReactNode;
    text: string;
    href: string;
    active?: boolean;
    type?: 'primary' | 'secondary';
}

export default function NavLink({ Icon, text, href, active = false, type = 'secondary' }: NavLinkProps) {
    // Primary navigation (header buttons) - most prominent
    const primaryStyles = active
        ? 'bg-gradient-to-r from-[hsl(191,65%,53%)] to-[#0085A3] text-white shadow-lg border-primary'
        : 'text-foreground/80 hover:bg-primary/10 hover:text-primary border-transparent';

    // Secondary navigation (studio tabs) - medium prominence
    const secondaryStyles = active
        ? 'border-primary bg-primary/20 text-primary shadow-sm'
        : 'text-foreground/70 hover:bg-muted/50 hover:text-primary border-transparent';

    const styles = type === 'primary' ? primaryStyles : secondaryStyles;

    return (
        <li
            className={`${styles} flex flex-nowrap items-center justify-center gap-x-2.5 text-nowrap rounded-lg p-1.5 px-3.5 font-semibold transition-all duration-300 border`}
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
