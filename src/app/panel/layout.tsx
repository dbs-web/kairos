import { getServerSession } from 'next-auth';

import Nav from '@/components/ui/Nav/nav';
import SessionProvider from '../AuthProvider';
import { authOptions } from '@/lib/auth';
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return;
    }

    return (
        <SessionProvider session={session}>
            <main className={`grid h-screen w-screen grid-cols-1 grid-rows-[64px_1fr]`}>
                <Nav />
                {children}
            </main>
        </SessionProvider>
    );
}
