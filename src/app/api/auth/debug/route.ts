import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/utils/auth';

export async function GET(req: NextRequest) {
  // Only allow access from admin users
  const token = req.cookies.get('token')?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  const userData = verifyToken(token);
  
  if (!userData) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
  
  if (userData.role !== 'super-admin') {
    return NextResponse.json(
      { error: 'Unauthorized access' },
      { status: 403 }
    );
  }
  
  // For admin debugging purposes only
  const allCookies = Object.fromEntries(
    req.cookies.getAll().map(cookie => [cookie.name, cookie.value])
  );
  
  return NextResponse.json(
    { 
      message: 'Auth debug info',
      token: {
        valid: !!userData,
        payload: userData
      },
      cookies: allCookies,
      session: {
        active: !!userData,
        expiresIn: userData ? (userData.exp - Math.floor(Date.now() / 1000)) : 0,
        expiryDate: userData ? new Date(userData.exp * 1000).toISOString() : null
      }
    },
    { status: 200 }
  );
}
