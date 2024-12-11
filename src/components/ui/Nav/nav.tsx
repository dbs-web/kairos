'use client';
// Hooks
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Icons
import { IoIosPlayCircle } from 'react-icons/io';
import { BiBook } from 'react-icons/bi';
import { IoHelpCircleOutline } from 'react-icons/io5';

// Components
import Image from 'next/image';
import NavLink from './nav-link';
import NavUserMenu from './nav-user-menu';

const navLinks = [
    {
        Icon: <IoIosPlayCircle className="mb-1 text-xl" />,
        text: 'Estúdio',
        href: '/panel/estudio/planejamento',
    },
    {
        Icon: <BiBook className="mb-1 text-xl" />,
        text: 'Conhecimento',
        href: '/panel/conhecimento',
    },
    {
        Icon: <IoHelpCircleOutline className="mb-1 text-xl" />,
        text: 'Ajuda',
        href: '/panel/ajuda',
    },
];

export default function Nav() {
    const path = usePathname();
    const { data: session } = useSession();

    return (
        <nav className="flex h-16 w-screen items-center justify-between border-b px-12">
            <Image
                src={'/kairos-logo-title.webp'}
                width={160}
                height={40}
                alt="Kairós logo"
                priority
            />

            <ul className="flex items-center justify-center gap-x-4">
                {navLinks?.length &&
                    navLinks.map((navLink, index) => (
                        <NavLink
                            Icon={navLink.Icon}
                            text={navLink.text}
                            href={navLink.href}
                            active={path === navLink.href}
                            key={`nav-link-${index}`}
                        />
                    ))}
            </ul>

            {session?.user?.name && session?.user?.email && (
                <NavUserMenu name={session.user.name} email={session.user.email} />
            )}
        </nav>
    );
}
