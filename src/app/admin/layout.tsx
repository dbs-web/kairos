import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CiUser } from 'react-icons/ci';
import { LuLogs } from 'react-icons/lu';
import AdminLayoutClient from './AdminLayoutClient';

const adminLinks = [
    {
        Icon: <CiUser className="mb-1 text-xl" />,
        text: 'Clientes',
        href: '/admin/clientes',
    },
    {
        Icon: <LuLogs className="mb-1 text-xl" />,
        text: 'Logs',
        href: '/admin/logs',
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
        <AdminLayoutClient session={session} adminLinks={adminLinks}>
            {children}
        </AdminLayoutClient>
    );
}





