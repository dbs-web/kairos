'use client';
import ClientTools from '@/components/Admin/Clients/ClientTools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryClientProvider client={queryClient}>
            <section className="grid h-full w-full grid-rows-1 gap-y-4 px-12">{children}</section>
        </QueryClientProvider>
    );
}
