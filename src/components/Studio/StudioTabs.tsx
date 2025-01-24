'use client';
//hooks
import { usePathname } from 'next/navigation';

//Icons
import { GoLightBulb } from 'react-icons/go';
import { PiNewspaperLight } from 'react-icons/pi';
import { CiCircleCheck } from 'react-icons/ci';
import { IoPlaySkipForwardOutline } from 'react-icons/io5';
import { IoPlayForwardOutline } from 'react-icons/io5';
import NavLink from '../ui/Nav/nav-link';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

const tabs = [
    {
        Icon: <GoLightBulb className="mb-1 lg:text-xl" />,
        text: 'Planejamento Mensal',
        href: '/panel/estudio/planejamento',
    },
    {
        Icon: <PiNewspaperLight className="mb-1 lg:text-xl" />,
        text: 'Notícias',
        href: '/panel/estudio/noticias',
    },
    {
        Icon: <CiCircleCheck className="mb-1 lg:text-xl" />,
        text: 'Aprovações',
        href: '/panel/estudio/aprovacoes',
    },
    {
        Icon: <IoPlaySkipForwardOutline className="mb-1 lg:text-xl" />,
        text: 'Finalizados',
        href: '/panel/estudio/finalizados',
    },
    {
        Icon: <IoPlayForwardOutline className="mb-1 lg:text-xl" />,
        text: 'Vídeo Rápido',
        href: '/panel/estudio/video-rapido',
    },
];

export default function StudioTabs() {
    const path = usePathname();
    return (
        <ScrollArea className="w-full pb-4 lg:w-2/3">
            <ul className="flex w-full flex-nowrap items-center justify-between gap-2 md:gap-x-4 lg:w-2/3 lg:justify-start">
                {tabs?.length > 0 &&
                    tabs.map((tab, index) => (
                        <NavLink
                            Icon={tab.Icon}
                            text={tab.text}
                            href={tab.href}
                            key={`tab-${index}`}
                            active={path === tab.href}
                        />
                    ))}
            </ul>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
