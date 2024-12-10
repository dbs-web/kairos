import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/panel')) {
        const sessionToken =
            req.cookies.get('next-auth.session-token') ||
            req.cookies.get('__Secure-next-auth.session-token');

        if (!sessionToken) {
            const loginUrl = new URL('/login', req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/panel/:path*',
};