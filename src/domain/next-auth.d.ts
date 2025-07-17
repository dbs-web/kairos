import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { UserRoles } from './entities/user';

declare module 'next-auth' {
    interface User extends DefaultUser {
        id: number;
        role: 'USER' | 'ADMIN';
        sessionVersion?: number;
    }

    interface Session {
        user?: {
            id: number;
            role: UserRoles;
            sessionVersion?: number;
        } & DefaultSession['user'];
    }

    interface JWT {
        user: {
            id: number;
            role: 'USER' | 'ADMIN';
            sessionVersion?: number;
        } & DefaultUser;
    }
}

