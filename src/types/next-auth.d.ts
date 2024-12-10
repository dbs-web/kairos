import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
    interface User extends DefaultUser {
        _id: string;
        role: 'user' | 'admin';
    }

    interface Session {
        user?: {
            id: string;
            role: 'user' | 'admin';
        } & DefaultSession['user'];
    }

    interface JWT {
        user: {
            id: string;
            role: 'user' | 'admin';
        } & DefaultUser;
    }
}
