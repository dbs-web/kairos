'use client';
import NavLinks from '@/components/ui/Nav/nav-links';
import { ILink } from '@/types/link';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CiCircleList, CiCirclePlus } from 'react-icons/ci';

const clientsLinks: ILink[] = [
    {
        Icon: <CiCircleList className="mb-1 text-xl" />,
        text: 'Ver Clientes',
        href: '/admin/clientes',
    },
    {
        Icon: <CiCirclePlus className="mb-1 text-xl" />,
        text: 'Cadastrar',
        href: '/admin/clientes/cadastrar',
    },
];

const queryClient = new QueryClient();

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryClientProvider client={queryClient}>
            <section className="grid h-full w-full grid-rows-[100px_1fr] gap-y-4 px-12">
                <NavLinks links={clientsLinks} type="secondary" />
                {children}
            </section>
        </QueryClientProvider>
    );
}
