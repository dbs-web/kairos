import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const font = Inter({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
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
            <body className={`${font.className}`}>{children}</body>
        </html>
    );
}
