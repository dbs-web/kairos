import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const sessionToken =
        req.cookies.get('next-auth.session-token') ||
        req.cookies.get('__Secure-next-auth.session-token');

    const loginUrl = new URL('/login', req.url);
    const panelUrl = new URL('/panel', req.url);

    if (!sessionToken) {
        if (pathname.startsWith('/panel') || pathname === '/')
            return NextResponse.redirect(loginUrl);
    } else {
        if (pathname === '/' || pathname === '/login') return NextResponse.redirect(panelUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/panel/:path*', '/'],
};
