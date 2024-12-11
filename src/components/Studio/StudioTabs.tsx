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

const tabs = [
    {
        Icon: <GoLightBulb className="mb-1 text-xl" />,
        text: 'Sugestões',
        href: '/panel/estudio/sugestoes',
    },
    {
        Icon: <PiNewspaperLight className="mb-1 text-xl" />,
        text: 'Notícias',
        href: '/panel/estudio/noticias',
    },
    {
        Icon: <CiCircleCheck className="mb-1 text-xl" />,
        text: 'Aprovações',
        href: '/panel/estudio/aprovacoes',
    },
    {
        Icon: <IoPlaySkipForwardOutline className="mb-1 text-xl" />,
        text: 'Finalizados',
        href: '/panel/estudio/finalizados',
    },
    {
        Icon: <IoPlayForwardOutline className="mb-1 text-xl" />,
        text: 'Vídeo Rápido',
        href: '/panel/estudio/video-rapido',
    },
];

export default function StudioTabs() {
    const path = usePathname();
    return (
        <ul className="flex items-center justify-center gap-x-4">
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
    );
}
