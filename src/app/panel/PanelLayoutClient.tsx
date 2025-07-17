'use client';
import Nav from '@/components/ui/Nav/nav';
import SessionProvider from '../AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchDataProvider } from '@/hooks/use-search-data';
import { Session } from 'next-auth';

const queryClient = new QueryClient();

interface PanelLayoutClientProps {
    children: React.ReactNode;
    session: Session;
    navLinks: Array<{
        Icon: React.ReactNode;
        text: string;
        href: string;
    }>;
}

export default function PanelLayoutClient({ children, session, navLinks }: PanelLayoutClientProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <SearchDataProvider>
                <SessionProvider session={session}>
                    <main className={`grid h-screen w-screen grid-cols-1 grid-rows-[64px_1fr]`}>
                        <Nav links={navLinks} />
                        {children}
                    </main>
                </SessionProvider>
            </SearchDataProvider>
        </QueryClientProvider>
    );
}

