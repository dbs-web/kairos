import { NextResponse } from 'next/server';
import { withAuthorization } from '@/adapters/withAuthorization';
import { UserRoles } from '@/domain/entities/user';
import db from '@/infrastructure/database/DatabaseFactory';

export const POST = withAuthorization([UserRoles.ADMIN], async (request: Request) => {
    const { userIds } = await request.json();

    if (!Array.isArray(userIds) || userIds.length === 0) {
        return NextResponse.json({ message: 'Invalid user IDs' }, { status: 400 });
    }

    try {
        // Increment sessionVersion for all specified users
        const logoutPromises = userIds.map(userId =>
            db.update('user', {
                criteria: { id: Number(userId) },
                data: { sessionVersion: { increment: 1 } } as any
            })
        );

        await Promise.all(logoutPromises);

        return NextResponse.json({ 
            message: `Successfully logged out ${userIds.length} user(s)` 
        });
    } catch (error) {
        return NextResponse.json({ 
            message: 'Failed to logout users',
            error: error instanceof Error ? error.message : error
        }, { status: 500 });
    }
});

