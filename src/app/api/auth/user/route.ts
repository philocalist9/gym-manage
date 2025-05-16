import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/app/utils/auth';

export async function GET(req: NextRequest) {
  try {
    const { isAuthenticated, userData } = verifyAuth(req);

    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Prepare user data for client
    const user = {
      id: userData.id,
      email: userData.email,
      name: userData.gymName || '', // Name can come from gym name or user name depending on role
      role: userData.role,
      gymName: userData.gymName
    };

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
