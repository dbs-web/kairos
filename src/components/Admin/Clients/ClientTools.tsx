// Types
import { ILink } from '@/domain/link';

// Components
import ClientRegisterDialog from './ClientRegisterDialog';
import NavLinks from '@/components/ui/Nav/nav-links';

// Icons
import { CiCircleList } from 'react-icons/ci';

const clientsLinks: ILink[] = [
    {
        Icon: <CiCircleList className="mb-1 text-xl" />,
        text: 'Ver Clientes',
        href: '/admin/clientes',
    },
];

export default function ClientTools() {
    return (
        <div className="flex w-full items-center justify-between">
            <NavLinks links={clientsLinks} type="secondary" />

            <div className="flex items-center justify-center gap-x-4">
                <ClientRegisterDialog />
            </div>
        </div>
    );
}
