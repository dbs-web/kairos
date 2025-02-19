import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRoles } from '@/domain/entities/user';

export type Session = {
    id: number;
    name?: string | null | undefined;
    email?: string | null | undefined;
    role: UserRoles;
};

export function withAuthorization(
    allowedRoles: UserRoles[],
    handler: (request: Request, user: Session) => Promise<Response>,
) {
    return async (request: Request) => {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
        }

        if (session.user.role === UserRoles.ADMIN || allowedRoles.includes(session.user.role)) {
            return handler(request, session.user);
        }

        return NextResponse.json({ status: 403, message: 'Forbidden' }, { status: 403 });
    };
}
