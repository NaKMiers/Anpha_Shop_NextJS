import { NextRequest, NextResponse } from 'next/server'
import { JWT, getToken } from 'next-auth/jwt'

// Require Auth
const requireAuth = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require Auth -')

  // check auth
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  console.log('req.url:', req.url)

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-url', new URL(req.url).pathname.toString())

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// Require UnAuth
const requireUnAuth = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require UnAuth -')

  // check auth
  if (token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

// Require Admin
const requireAdmin = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require Admin -')

  // check auth
  if (token?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

// Middleware
export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET })

  console.log('token', token)

  if (req.nextUrl.pathname.startsWith('/admin')) {
    return requireAdmin(req, token)
  } else if (req.nextUrl.pathname.startsWith('/user') || req.nextUrl.pathname.startsWith('/recharge')) {
    return requireAuth(req, token)
  } else if (req.nextUrl.pathname.startsWith('/auth')) {
    return requireUnAuth(req, token)
  }
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/recharge', '/auth/:path*'],
}
