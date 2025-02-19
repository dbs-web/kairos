import bcrypt from 'bcryptjs';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Use Cases
import { getUsersUseCase } from '@/use-cases/UserUseCases';

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            id: 'credentials',
            credentials: {
                email: {
                    label: 'e-mail',
                    type: 'email',
                    placeholder: 'email@exemplo.com',
                },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                const user = await getUsersUseCase.byEmail(credentials.email);

                if (user) {
                    const isMatch = await bcrypt.compare(credentials.password, user.password);
                    if (isMatch) {
                        return user;
                    } else {
                        throw new Error('E-mail e/ou password incorretos!');
                    }
                } else {
                    throw new Error('E-mail e/ou password incorretos!');
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
        newUser: '/panel',
        error: '/login',
    },
    callbacks: {
        async jwt({ token, trigger, session, user }) {
            if (trigger === 'update' && session) {
                token.user = session;
                return token;
            }

            if (user) {
                token.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                //@ts-expect-error
                session.user = token.user;
            }
            return session;
        },
    },
};

export default NextAuth(authOptions);
