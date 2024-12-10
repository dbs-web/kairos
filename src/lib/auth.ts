import bcrypt from 'bcryptjs';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { dbConnect } from './dbConnect';
import clientPromise from './clientPromise';
import { User } from '@/models';

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
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
                try {
                    await dbConnect();
                    const user = await User.findOne({
                        email: credentials.email,
                    });

                    if (user) {
                        const isMatch = await bcrypt.compare(credentials.password, user.password);
                        if (isMatch) {
                            return user;
                        } else {
                            throw new Error('E-mail ou password estão incorretos!');
                        }
                    } else {
                        throw new Error('Usuário não encontrado');
                    }
                } catch (err) {
                    console.log(err);
                    throw new Error('Erro na autenticação');
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
                    name: user.name,
                    email: user.email,
                };
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = token.user;
            }
            return session;
        },
    },
};

export default NextAuth(authOptions);
