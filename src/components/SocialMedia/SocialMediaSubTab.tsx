import { ReactNode } from 'react';

interface SocialMediaSubTabProps {
    Icon?: ReactNode;
    text: string;
    href: string;
    active?: boolean;
}

export default function SocialMediaSubTab({ Icon, text, href, active = false }: SocialMediaSubTabProps) {
    return (
        <li
            className={`${
                active
                    ? 'border-primary/60 bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm'
                    : 'text-foreground/60 hover:bg-muted/30 hover:text-foreground/80 border-transparent'
            } flex flex-nowrap items-center justify-center gap-x-2 text-nowrap rounded-md p-1.5 px-3 font-medium text-sm transition-all duration-200 border`}
        >
            {Icon && (
                <span className="transition-transform duration-200 group-hover:scale-105 text-sm">
                    {Icon}
                </span>
            )}
            <a href={href} className="text-sm">
                {text}
            </a>
        </li>
    );
}
