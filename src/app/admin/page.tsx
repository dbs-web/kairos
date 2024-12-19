import { redirect } from 'next/navigation';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (session?.user?.role === 'ADMIN') {
        return redirect('/admin/clientes');
    }
    return <div></div>;
}
