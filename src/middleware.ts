import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Only run middleware for admin routes (except login)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // For edge runtime compatibility, we'll do a simple token existence check
    // The actual JWT verification will happen in the API routes
    if (!token || token.trim() === '') {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin-token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};