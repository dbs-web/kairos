import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const font = Plus_Jakarta_Sans({
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
    variable: '--font-plus-jakarta',
});

import './globals.css';

export const metadata: Metadata = {
    title: 'Kairos',
    description: '',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-br">
            <body className={`${font.className}`}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
