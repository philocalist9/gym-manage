import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gymsync-secure-jwt-token';
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

// Super admin credentials
const SUPER_ADMIN_EMAIL = 'super@admin.com';
const SUPER_ADMIN_PASSWORD = 'Admin@2025';

export interface TokenPayload {
  id: string;
  email: string;
  gymName: string;
  role: string;
  iat: number;
  exp: number;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  gymName?: string;
}

/**
 * Extract token from request cookies
 */
export function getTokenFromRequest(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  return token;
}

/**
 * Verify JWT token and return payload if valid
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Get token from server component
 */
export function getTokenFromServerComponent() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  return token;
}

/**
 * Verify authentication from request
 */
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

/**
 * Create a JWT token for a user
 */
export function createToken(payload: Omit<TokenPayload, 'iat' | 'exp'>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_MAX_AGE });
}

/**
 * Set authentication cookie in response
 */
export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE,
    path: '/'
  });
}

/**
 * Clear authentication cookie in response
 */
export function clearAuthCookie(response: NextResponse) {
  response.cookies.set('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
}

/**
 * Check if credentials match super admin
 */
export function isSuperAdminCredentials(email: string, password: string): boolean {
  return email === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASSWORD;
}

/**
 * Get super admin token payload
 */
export function getSuperAdminPayload() {
  return {
    id: 'super-admin-id',
    email: SUPER_ADMIN_EMAIL,
    gymName: 'System Administrator',
    role: 'super-admin'
  };
}

/**
 * Get user session from server component
 * Returns the user data if authenticated, null otherwise
 */
export async function getUserSession(): Promise<SessionUser | null> {
  try {
    const token = getTokenFromServerComponent();
    if (!token) return null;
    
    const userData = verifyToken(token);
    if (!userData) return null;
    
    return {
      id: userData.id,
      email: userData.email,
      name: userData.gymName || '', // Adjust as needed based on user type
      role: userData.role,
      gymName: userData.gymName
    };
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
}