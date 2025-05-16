import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gymsync-secure-jwt-token';

interface TokenPayload {
  id: string;
  email: string;
  gymName: string;
  role: string;
  iat: number;
  exp: number;
}

export function getTokenFromRequest(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  return token;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromServerComponent() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  return token;
}

export function verifyAuth(req: NextRequest) {
  const token = getTokenFromRequest(req);
  
  if (!token) {
    return { isAuthenticated: false, userData: null };
  }
  
  const userData = verifyToken(token);
  
  if (!userData) {
    return { isAuthenticated: false, userData: null };
  }
  
  return { isAuthenticated: true, userData };
}