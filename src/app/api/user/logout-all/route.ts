import { NextResponse } from 'next/server';
import { withAuthorization } from '@/adapters/withAuthorization';
import { UserRoles } from '@/domain/entities/user';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST = withAuthorization([UserRoles.ADMIN], async (request: Request) => {
    try {
        // Increment sessionVersion for ALL users
        await prisma.user.updateMany({
            data: { sessionVersion: { increment: 1 } }
        });

        return NextResponse.json({ 
            message: 'Successfully logged out all users' 
        });
    } catch (error) {
        return NextResponse.json({ 
            message: 'Failed to logout all users',
            error: error instanceof Error ? error.message : error
        }, { status: 500 });
    }
});


