'use client';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import NavLink from './nav-link';
import { AiOutlineBulb } from 'react-icons/ai';
import { PiNewspaper } from 'react-icons/pi';
import { CiVideoOn, CiCircleList } from 'react-icons/ci';
import { useSession } from 'next-auth/react';
import NavUserMenu from './nav-user-menu';

const navLinks = [
    {
        Icon: <AiOutlineBulb className="mb-1 text-xl" />,
        text: 'Sugestões',
        href: '/panel/sugestoes',
    },
    { Icon: <PiNewspaper className="mb-1 text-xl" />, text: 'Notícias', href: '/panel/noticias' },
    {
        Icon: <CiVideoOn className="mb-1 text-xl" />,
        text: 'Video Maker',
        href: '/panel/video-maker',
    },
    {
        Icon: <CiCircleList className="mb-1 text-xl" />,
        text: 'Briefings',
        href: '/panel/briefings',
    },
];

export default function Nav() {
    const path = usePathname();
    const { data: session } = useSession();

    return (
        <nav className="flex h-16 w-screen items-center justify-between border-b px-12">
            <Image src={'/kairos-logo-title.webp'} width={160} height={40} alt="Kairós logo" />

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
