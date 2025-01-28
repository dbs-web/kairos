import { UserRoles } from '@/types/user';
import { getServerSession } from 'next-auth';
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { authOptions } from './auth';
import { Session } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type ApiResponseParams = {
    route: string;
    body: any;
    status: number;
    message: string;
    error?: string;
    data?: {};
};

const API_SECRET = process.env.API_SECRET ?? '';

export async function validateExternalRequest(headers: ReadonlyHeaders): Promise<boolean> {
    if (!API_SECRET) throw new Error('API SECRET IS NOT SET');
    const secret = headers.get('x-api-key');
    return secret === API_SECRET;
}

export function isAuthorized(session: Session | null, allowedRoles: UserRoles[]): boolean {
    if (!session?.user || !allowedRoles.includes(session.user.role as UserRoles)) {
        return false;
    }
    return true;
}

export async function getSession(): Promise<Session | null> {
    const session = await getServerSession(authOptions);
    return session;
}

/**
 * Wrapper function to create API responses and log them to the database.
 */
export async function createApiResponse({
    route,
    body,
    status,
    message,
    error,
    data,
}: ApiResponseParams) {
    // Log the API response to the database
    await prisma.apiLog.create({
        data: {
            route,
            body,
            responseCode: status,
            error: error || null,
        },
    });

    // Return the response to the API
    return NextResponse.json({ message, status, ...data }, { status });
}
