'use client';
import ClientTools from '@/components/Admin/Clients/ClientTools';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="grid h-full w-full grid-rows-[100px_1fr] gap-y-4 px-12">
            <ClientTools />
            {children}
        </section>
    );
}

