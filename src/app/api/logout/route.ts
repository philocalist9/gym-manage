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
        ...(isSuperAdmin && { superAdminLogout: true, timestamp: new Date().toISOString() })
      },
      { status: 200 }
    );

    // Clear the token cookie using our utility function
    clearAuthCookie(response);
    
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
