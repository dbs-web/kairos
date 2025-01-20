import StudioTools from '@/components/Studio/StudioTools';
import { DataFilterProvider } from '@/hooks/use-data-filter';

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DataFilterProvider>
            <section className="grid max-h-full w-full grid-cols-1 grid-rows-[100px_calc(100vh-100px)] gap-y-4 overflow-hidden px-12">
                <StudioTools />
                {children}
            </section>
        </DataFilterProvider>
    );
}
