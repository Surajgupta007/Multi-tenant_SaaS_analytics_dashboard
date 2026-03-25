import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PUBLIC_PATHS = [
  '/', 
  '/login', 
  '/register',
  '/api/auth', 
  '/api/stripe/webhook'
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. Skip public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // 2. Verify session
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 3. Extract orgSlug from URL: /[orgSlug]/...
  const segments = pathname.split('/').filter(Boolean)
  const orgSlug = segments[0]

  if (!orgSlug) return NextResponse.next()

  // 4. Inject headers for downstream use
  const res = NextResponse.next()
  res.headers.set('x-user-id', token.sub!)
  res.headers.set('x-org-slug', orgSlug)

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
