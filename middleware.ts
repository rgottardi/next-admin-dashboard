import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is not logged in and trying to access protected routes
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth/signout')
  ) {
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is logged in, get their role
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const userRole = profile?.role || 'user'

    // Redirect from login/register pages if already logged in
    if (
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname === '/'
    ) {
      const redirectUrl = new URL(
        userRole === 'admin' ? '/admin' : '/user',
        request.url
      )
      return NextResponse.redirect(redirectUrl)
    }

    // Protect admin routes
    if (
      request.nextUrl.pathname.startsWith('/admin') &&
      userRole !== 'admin'
    ) {
      const redirectUrl = new URL('/user', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Protect user routes from admin (optional, remove if admins should access user routes)
    if (
      request.nextUrl.pathname.startsWith('/user') &&
      userRole === 'admin'
    ) {
      const redirectUrl = new URL('/admin', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}