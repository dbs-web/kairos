import StudioTools from '@/components/Studio/StudioTools';

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className={`grid h-full w-full grid-cols-1 grid-rows-[100px_1fr] gap-y-4 px-12`}>
            <StudioTools />
            {children}
        </section>
    );
}
