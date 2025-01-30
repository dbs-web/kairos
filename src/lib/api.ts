import { UserRoles } from '@/types/user';
import { getServerSession } from 'next-auth';
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { authOptions } from './auth';
import { Session } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Status } from '@/types/status';

type ApiResponseParams = {
    route: string;
    body: any;
    status: number;
    message: string;
    error?: string;
    data?: {};
    log?: boolean;
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
    log = true,
}: ApiResponseParams) {
    // Log the API response to the database
    if (log)
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

export async function getUserDifyAgent(userId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.difyAgent) {
        throw new Error('User not found or difyAgent not set.');
    }
    return user.difyAgent;
}

export async function createBriefings(suggestionsData: any[], userId: number) {
    const briefingsToCreate = suggestionsData.map((suggestion) => ({
        title: suggestion.title,
        date: new Date().toISOString(),
        suggestionId: suggestion.id,
        status: Status.EM_PRODUCAO,
        userId: userId,
    }));
    return prisma.briefing.createMany({ data: briefingsToCreate });
}

export async function sendContentCreationRequest(
    briefingId: number,
    query: string,
    difyAgentToken: string,
) {
    const CONTENT_CREATION_URL = process.env.CONTENT_CREATION_URL ?? '';
    if (!CONTENT_CREATION_URL) {
        throw new Error('CONTENT_CREATION_URL is not set');
    }

    await fetch(CONTENT_CREATION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: difyAgentToken, briefingId, message: query, callback: true }),
    });
}

export async function getSuggestionsData(suggestions: number[]) {
    return prisma.suggestion.findMany({
        where: { id: { in: suggestions } },
    });
}

export async function updateSuggestionsStatus(suggestions: number[]) {
    await prisma.suggestion.updateMany({
        where: { id: { in: suggestions } },
        data: {
            status: Status.EM_PRODUCAO,
        },
    });
}
