import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, createToken, setAuthCookie } from '@/app/utils/auth';

/**
 * Route handler for refreshing authentication token
 * This extends the user's session if they have a valid existing token
 */
export async function POST(req: NextRequest) {
  try {
    const { isAuthenticated, userData } = verifyAuth(req);

    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Create a fresh token with the same data
    const isSuperAdmin = userData.role === 'super-admin';
    const newToken = createToken(
      {
        id: userData.id,
        email: userData.email,
        gymName: userData.gymName,
        role: userData.role
      },
      isSuperAdmin
    );

    // Create response
    const response = NextResponse.json(
      { 
        message: 'Session refreshed successfully',
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.gymName || '',
          role: userData.role,
          gymName: userData.gymName
        }
      },
      { status: 200 }
    );
    
    // Set refreshed auth cookie
    setAuthCookie(response, newToken, isSuperAdmin);
    
    return response;
  } catch (error: any) {
    console.error('Error refreshing session:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
