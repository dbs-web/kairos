'use client';

import { usePathname } from 'next/navigation';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import SocialMediaSubTab from './SocialMediaSubTab';

// Icons
import { FaChartLine, FaEye } from 'react-icons/fa';
import { BiTrendingUp } from 'react-icons/bi';

interface SocialMediaLayoutProps {
    children: React.ReactNode;
}

const socialMediaTabs = [
    {
        Icon: <FaEye className="text-sm" />,
        text: 'Monitoramento',
        href: '/panel/estudio/redes-sociais/monitoramento',
    },
    {
        Icon: <FaChartLine className="text-sm" />,
        text: 'Desempenho',
        href: '/panel/estudio/redes-sociais/desempenho',
    },
    {
        Icon: <BiTrendingUp className="text-sm" />,
        text: 'Radar de Tendências',
        href: '/panel/estudio/redes-sociais/radar-tendencias',
    },
];

export default function SocialMediaLayout({ children }: SocialMediaLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-full flex-col">
            {/* Social Media Sub-tabs */}
            <div className="border-b border-border/20 bg-card/30 backdrop-blur-sm">
                <div className="px-4 sm:px-6 md:px-12">
                    {/* Visual separator line to show this is a sub-level */}
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

                    <ScrollArea className="w-full">
                        <ul className="flex items-center gap-x-3 py-3">
                            {socialMediaTabs.map((tab, index) => (
                                <SocialMediaSubTab
                                    key={`social-tab-${index}`}
                                    Icon={tab.Icon}
                                    text={tab.text}
                                    href={tab.href}
                                    active={pathname === tab.href}
                                />
                            ))}
                        </ul>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden bg-card/30 backdrop-blur-sm">
                <ScrollArea className="h-full px-4 sm:px-6 md:px-12 py-6">
                    {children}
                </ScrollArea>
            </div>
        </div>
    );
}
