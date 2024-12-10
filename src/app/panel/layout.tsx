import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Roboto } from 'next/font/google';
const font = Roboto({
    weight: '400',
    subsets: ['latin'],
});

import '../globals.css';
import Nav from '@/components/ui/Nav/nav';
import SessionProvider from '../AuthProvider';

export const metadata: Metadata = {
    title: 'Kairos',
    description: '',
};
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession();

    if (!session) {
        return;
    }

    return (
        <html lang="pt-br">
            <body className={`${font.className} antialiased`}>
                <SessionProvider session={session}>
                    <Nav />
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
