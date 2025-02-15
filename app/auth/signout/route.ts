import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  // Sign out on server side
  await supabase.auth.signOut()

  // Create response with redirect
  const response = NextResponse.redirect(new URL('/auth/login', request.url), {
    status: 302,
  })

  // Clear all auth cookies
  const allCookies = cookieStore.getAll()
  allCookies.forEach((cookie) => {
    if (cookie.name.includes('supabase') || cookie.name.includes('sb-')) {
      response.cookies.delete(cookie.name)
    }
  })

  // Set cache control headers to prevent caching
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  response.headers.set('Pragma', 'no-cache')

  return response
}

// Also handle GET requests by redirecting to login
export async function GET(request: Request) {
  return NextResponse.redirect(new URL('/auth/login', request.url), {
    status: 302,
  })
}