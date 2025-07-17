import { getServerSession } from 'next-auth';
import Nav from '@/components/ui/Nav/nav';
import SessionProvider from '../AuthProvider';
import { authOptions } from '@/lib/auth';
import { IoIosPlayCircle } from 'react-icons/io';
import { BiBook } from 'react-icons/bi';
import { IoHelpCircleOutline } from 'react-icons/io5';
import { redirect } from 'next/navigation';
import PanelLayoutClient from './PanelLayoutClient';

const navLinks = [
    {
        Icon: <IoIosPlayCircle className="mb-1 text-xl" />,
        text: 'Estúdio',
        href: '/panel/estudio',
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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);

    if (session) {
        if (session.user?.role === 'ADMIN') {
            return redirect('/admin');
        }
    } else {
        return;
    }

    return (
        <PanelLayoutClient session={session} navLinks={navLinks}>
            {children}
        </PanelLayoutClient>
    );
}

