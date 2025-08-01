import StudioTools from '@/components/Studio/StudioTools';
import { SearchDataProvider } from '@/hooks/use-search-data';
import { ScrollArea } from '@/components/ui/scroll-area';

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SearchDataProvider>
            <section className="grid max-h-full w-screen grid-cols-1 grid-rows-[100px_1fr] overflow-x-hidden xl:grid-rows-[64px_1fr]">
                <StudioTools />
                <ScrollArea className="h-full">{children}</ScrollArea>
            </section>
        </SearchDataProvider>
    );
}
