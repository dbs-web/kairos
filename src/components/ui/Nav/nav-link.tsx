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
            className={`${
                active
                    ? 'border bg-white text-primary shadow-md'
                    : 'hover:bg-neutral-100 hover:text-primary'
            } flex flex-nowrap items-center justify-center gap-x-2.5 text-nowrap rounded-lg p-1.5 px-3.5 font-semibold text-neutral-700 transition-all duration-300`}
        >
            <span className="transition-transform duration-300 group-hover:scale-105">{Icon}</span>
            <a href={href} className="text-base">
                {text}
            </a>
        </li>
    );
}
