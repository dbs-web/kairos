'use client';
import { ILink } from '@/domain/link';

// Hooks
import { useSession } from 'next-auth/react';

// Components
import Image from 'next/image';
import NavUserMenu from './nav-user-menu';
import NavLinks from './nav-links';

import { RxHamburgerMenu } from 'react-icons/rx';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import NavLink from './nav-link';

interface NavProps {
    links: ILink[];
}

export default function Nav({ links }: NavProps) {
    const { data: session } = useSession();

    return (
        <nav className="flex h-16 w-screen items-center justify-between gap-x-8 border-b border-border bg-card px-6 lg:px-12">
            <Image
                src={'/kairos-logo-simbol-color.webp'}
                width={160}
                height={40}
                alt="Kairós logo"
                priority
            />
            <div className="hidden md:block">
                <NavLinks links={links} type="main" />
            </div>

            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="rounded-lg bg-muted p-2 text-foreground">
                            <RxHamburgerMenu />
                        </button>
                    </SheetTrigger>
                    <SheetContent className="border-border bg-card">
                        <SheetHeader>
                            <SheetTitle className="text-foreground">Links</SheetTitle>
                            <SheetDescription className="text-foreground/70">
                                {links?.length > 0 &&
                                    links.map((link, index) => (
                                        <NavLink {...link} key={`mobile-link-${index}`} />
                                    ))}
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="hidden md:block">
                {session?.user?.name && session?.user?.email && (
                    <NavUserMenu name={session.user.name} email={session.user.email} />
                )}
            </div>
        </nav>
    );
}
