import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Auth condition handling
  if (!session) {
    // Handle auth routes
    if (req.nextUrl.pathname.startsWith('/auth')) {
      return res;
    }
    // Redirect to login if accessing protected routes
    if (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/user')) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  // Role-based access control
  if (session) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Redirect from auth routes if already logged in
    if (req.nextUrl.pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // Handle admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

      if (profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/user', req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};