import StudioTools from '@/components/Studio/StudioTools';
import { SearchDataProvider } from '@/hooks/use-search-data';

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SearchDataProvider>
            <section className="grid max-h-full w-screen grid-cols-1 grid-rows-[100px_calc(100vh-100px)] gap-y-4 overflow-x-hidden px-4 sm:px-6 md:px-12">
                <StudioTools />
                {children}
            </section>
        </SearchDataProvider>
    );
}
