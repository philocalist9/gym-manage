import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie, verifyAuth } from '@/app/utils/auth';

export async function POST(req: NextRequest) {
  try {
    // Get auth status to check if it's a super admin
    const { isAuthenticated, userData } = verifyAuth(req);
    const isSuperAdmin = isAuthenticated && userData?.role === 'super-admin';
    
    // Create response
    const response = NextResponse.json(
      { 
        message: 'Logged out successfully',
        // Include additional info for super admin for logging purposes
        ...(isSuperAdmin && { superAdminLogout: true, timestamp: new Date().toISOString() }),
        // Include a cache busting token to ensure the response is not cached
        cacheBuster: Date.now()
      },
      { status: 200 }
    );

    // Clear the token cookie using our utility function
    clearAuthCookie(response);
    
    // Add cache control headers to prevent browser caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    // For super admin, we might want to log this event for auditing
    if (isSuperAdmin) {
      console.log(`Super admin logged out: ${userData?.email} at ${new Date().toISOString()}`);
      // In a real implementation, you might want to log this to a database
      // await logSuperAdminActivity(userData?.id, 'logout');
    }

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Something went wrong during logout' },
      { status: 500 }
    );
  }
}
