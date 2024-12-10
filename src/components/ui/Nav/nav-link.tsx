import { ReactNode } from 'react';

interface NavLinkProps {
    Icon: ReactNode;
    text: string;
    href: string;
    active?: boolean;
}

export default function NavLink({ Icon, text, href, active = false }: NavLinkProps) {
    return (
        <li
            className={`${active ? 'border bg-white text-primary shadow-md' : ''} flex items-center justify-center gap-x-2 rounded-lg p-2 font-bold text-neutral-500 transition-all duration-300 hover:bg-neutral-100`}
        >
            {Icon}
            <a href={href}>{text}</a>
        </li>
    );
}
