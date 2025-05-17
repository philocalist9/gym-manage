import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gymsync-secure-jwt-token';
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds
const SUPER_ADMIN_SESSION_MAX_AGE = 4 * 60 * 60; // 4 hours in seconds (more strict for super admin)

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
export function createToken(payload: Omit<TokenPayload, 'iat' | 'exp'>, isSuperAdmin = false) {
  const expiresIn = isSuperAdmin ? SUPER_ADMIN_SESSION_MAX_AGE : TOKEN_MAX_AGE;
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Set authentication cookie in response
 */
export function setAuthCookie(response: NextResponse, token: string, isSuperAdmin = false) {
  const maxAge = isSuperAdmin ? SUPER_ADMIN_SESSION_MAX_AGE : TOKEN_MAX_AGE;
  
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
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

/**
 * Check if a session is close to expiry (needs refresh)
 * Returns true if token expiration is within the threshold window
 */
export function isSessionNearExpiry(token: string, thresholdMinutes = 30): boolean {
  if (!token) return false;
  
  try {
    const decoded = verifyToken(token);
    if (!decoded) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const expiryTime = decoded.exp;
    const thresholdSeconds = thresholdMinutes * 60;
    
    // Return true if expiration is within the threshold window
    return expiryTime - currentTime <= thresholdSeconds;
  } catch (error) {
    console.error('Error checking session expiry:', error);
    return false;
  }
}