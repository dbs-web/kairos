'use client';
import { ILink } from '@/types/link';

// Hooks
import { useSession } from 'next-auth/react';

// Components
import Image from 'next/image';
import NavUserMenu from './nav-user-menu';
import NavLinks from './nav-links';

interface NavProps {
    links: ILink[];
}

export default function Nav({ links }: NavProps) {
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

            <NavLinks links={links} type="main" />

            {session?.user?.name && session?.user?.email && (
                <NavUserMenu name={session.user.name} email={session.user.email} />
            )}
        </nav>
    );
}
