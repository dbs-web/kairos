import SocialMediaLayout from '@/components/SocialMedia/SocialMediaLayout';

export default async function RedesSociaisLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SocialMediaLayout>
            {children}
        </SocialMediaLayout>
    );
}
