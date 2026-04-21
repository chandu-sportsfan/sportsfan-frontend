import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";

const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/error',          
    '/api/auth', 
    '/api/auth/set-password',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/send-otp',
    '/api/auth/verify-otp',
    '/images', 
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPublicRoute = publicRoutes.some(route => {
        if (route === '/') return pathname === '/';
        return pathname.startsWith(route);
    });

    // Single unified auth check
    const manualToken = request.cookies.get("token")?.value;
    const googleToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const isLoggedIn = !!manualToken || !!googleToken;

    // Not logged in + protected route → send to login
    if (!isLoggedIn && !isPublicRoute) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Logged in + trying to access login/register → send to app
    // IMPORTANT: only redirect on specific auth pages, not ALL public routes
    const authPages = ['/auth/login', '/auth/register'];
    if (isLoggedIn && authPages.some(p => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL('/MainModules/HomePage', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};