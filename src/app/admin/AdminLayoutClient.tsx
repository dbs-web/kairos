'use client';
import Nav from '@/components/ui/Nav/nav';
import SessionProvider from '../AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchDataProvider } from '@/hooks/use-search-data';
import { Session } from 'next-auth';

const queryClient = new QueryClient();

interface AdminLayoutClientProps {
    children: React.ReactNode;
    session: Session;
    adminLinks: Array<{
        Icon: React.ReactNode;
        text: string;
        href: string;
    }>;
}

export default function AdminLayoutClient({ children, session, adminLinks }: AdminLayoutClientProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider session={session}>
                <SearchDataProvider>
                    <section className="grid h-full w-full grid-cols-1 grid-rows-[100px_1fr] gap-y-4">
                        <Nav links={adminLinks} />
                        {children}
                    </section>
                </SearchDataProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
}


