import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        console.log('Instagram token revoke request received');
        
        // Get session
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            console.log('No session found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id;
        console.log('Revoking Instagram token for user:', userId);

        // Delete Instagram token from database
        await prisma.userSocialToken.deleteMany({
            where: {
                userId: userId,
                platform: 'INSTAGRAM'
            }
        });

        console.log('Instagram token revoked successfully');

        return NextResponse.json({ 
            success: true,
            message: 'Instagram token revoked successfully' 
        });

    } catch (error) {
        console.error('Error revoking Instagram token:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
