import { redirect } from 'next/navigation';

import { getServerSession } from 'next-auth';

import Nav from '@/components/ui/Nav/nav';
import SessionProvider from '../AuthProvider';
import { authOptions } from '@/lib/auth';
import { CiUser } from 'react-icons/ci';

const adminLinks = [
    {
        Icon: <CiUser className="mb-1 text-xl" />,
        text: 'Clientes',
        href: '/admin/clientes',
    },
];

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return redirect('/login');
    }

    if (session?.user?.role !== 'ADMIN') {
        return redirect('/panel');
    }

    return (
        <SessionProvider session={session}>
            <section className="grid h-full w-full grid-cols-1 grid-rows-[100px_1fr] gap-y-4">
                <Nav links={adminLinks} />
                {children}
            </section>
        </SessionProvider>
    );
}
