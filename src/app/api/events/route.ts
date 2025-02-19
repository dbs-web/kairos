import { withAuthorization } from '@/adapters/withAuthorization';
import { UserRoles } from '@/domain/entities/user';
import { NextResponse } from 'next/server';

export const GET = withAuthorization([UserRoles.USER, UserRoles.ADMIN], async (request, user) => {
    return NextResponse.json({
        data: [
            {
                title: 'Evento 1',
                date: '2025-01-24',
            },
            {
                title: 'Evento 2',
                date: '2025-01-24',
            },
            {
                title: 'Evento 3 Evento 3 Evento 3 Evento 3',
                date: '2025-01-27',
            },
            {
                title: 'Evento 4',
                date: '2025-01-26',
            },
            {
                title: 'Evento 5',
                date: '2025-01-25',
            },
        ],
    });
});
