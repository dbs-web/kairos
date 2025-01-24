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
            className={`${active ? 'border bg-white text-primary shadow-md' : ''} flex flex-nowrap items-center justify-center gap-x-1 text-nowrap rounded-lg p-1 px-2 font-bold text-neutral-500 transition-all duration-300 hover:bg-neutral-100 md:gap-x-2 md:p-2`}
        >
            {Icon}
            <a href={href} className="text-xs">
                {text}
            </a>
        </li>
    );
}
