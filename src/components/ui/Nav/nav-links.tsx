'use client';
import { ILink } from '@/domain/link';
import NavLink from './nav-link';

import { usePathname } from 'next/navigation';

interface NavLinksProps {
    links: ILink[];
    type: 'main' | 'secondary';
}

export default function NavLinks({ links, type }: NavLinksProps) {
    const path = usePathname();

    return (
        <ul className="flex items-start gap-x-4">
            {links?.length &&
                links.map((link, index) => (
                    <NavLink
                        Icon={link.Icon}
                        text={link.text}
                        href={link.href}
                        active={type === 'main' ? path.startsWith(link.href) : path === link.href}
                        key={`nav-link-${index}`}
                    />
                ))}
        </ul>
    );
}