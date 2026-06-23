import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const session = req.cookies.get(ADMIN_COOKIE);

  if (!session && req.nextUrl.pathname.startsWith('/admin/dashboard')) {
    const loginUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*']
};
