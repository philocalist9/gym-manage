import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/app/utils/auth';

export async function POST(req: NextRequest) {
  try {
    // Create response that will clear the token cookie
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear the token cookie using our utility function
    clearAuthCookie(response);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Something went wrong during logout' },
      { status: 500 }
    );
  }
}
