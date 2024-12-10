import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

const font = Roboto({
    weight: '400',
    subsets: ['latin'],
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
            <body className={`${font.className} antialiased`}>{children}</body>
        </html>
    );
}
