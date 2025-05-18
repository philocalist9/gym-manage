import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/app/utils/auth';

// Define which paths require authentication
const protectedPaths = [
  '/dashboard',  // This will cover all dashboard routes
  '/api/gym',    // Protect gym APIs, add more as needed
];

// Define public paths that should bypass authentication checks
const publicPaths = [
  '/login',
  '/register',
  '/api/login',
  '/api/register',
];

// Define paths accessible only to certain roles
const roleBasedPaths: Record<string, string[]> = {
  'gym-owner': ['/dashboard/gym-owner'],
  'member': ['/dashboard/member'],
  'trainer': ['/dashboard/trainer'],
  'super-admin': ['/dashboard/super-admin'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    // For login page, add cache control headers to ensure it's always fresh
    if (pathname === '/login') {
      const response = NextResponse.next();
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    }
    return NextResponse.next();
  }
  
  // Check if path requires protection
  const requiresAuth = protectedPaths.some(path => pathname.startsWith(path));
  
  if (requiresAuth) {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    // Redirect to login if no token
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      loginUrl.searchParams.set('from', 'session_expired');
      return NextResponse.redirect(loginUrl);
    }
    
    // Verify token
    const userData = verifyToken(token);
    
    // Special case: If it's a super admin token
    if (userData && userData.role === 'super-admin' && userData.email === 'super@admin.com') {
      // Always allow super admin access, regardless of database state
      // This ensures super admin can always access the system even if deleted from database
      
      // Special handling for super-admin routes
      if (pathname.startsWith('/dashboard/super-admin')) {
        // Add cache control headers for protected routes
        const response = NextResponse.next();
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        return response;
      }
    }
    
    // If token is invalid, redirect to login
    if (!userData) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      loginUrl.searchParams.set('from', 'invalid_token');
      return NextResponse.redirect(loginUrl);
    }
    
    // Check role-based access
    const userRole = userData.role;
    const roleAccessPaths = roleBasedPaths[userRole] || [];
    
    // If trying to access a path restricted to a specific role
    const checkingRoleAccess = Object.values(roleBasedPaths).some(paths => 
      paths.some(path => pathname.startsWith(path))
    );
    
    if (checkingRoleAccess && !roleAccessPaths.some(path => pathname.startsWith(path))) {
      // Redirect to appropriate dashboard based on role
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
    }
    
    // Add cache control headers for protected routes to prevent caching
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }
  
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/auth (NextAuth.js paths)
     * 2. /favicon.ico, /images/, /fonts/ (Static files)
     * 3. /_next/ (Next.js internals)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
};
