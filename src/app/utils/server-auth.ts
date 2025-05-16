import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from './auth';

/**
 * Function to protect server components
 * Redirects to login if not authenticated
 * Returns the user data if authenticated
 */
export async function protectPage(redirectTo = '/login') {
  const token = cookies().get('token')?.value;
  
  if (!token) {
    redirect(redirectTo);
  }
  
  const userData = verifyToken(token);
  
  if (!userData) {
    redirect(redirectTo);
  }
  
  return userData;
}

/**
 * Function to check if a user has a specific role
 * Redirects to appropriate dashboard if role doesn't match
 */
export async function checkRole(allowedRoles: string[], redirectToDashboard = true) {
  const userData = await protectPage();
  
  if (!allowedRoles.includes(userData.role)) {
    if (redirectToDashboard) {
      // Redirect to the appropriate dashboard based on role
      switch (userData.role) {
        case 'gym-owner':
          redirect('/dashboard/gym-owner');
        case 'trainer':
          redirect('/dashboard/trainer');
        case 'member':
          redirect('/dashboard/member');
        case 'super-admin':
          redirect('/dashboard/super-admin');
        default:
          redirect('/dashboard');
      }
    } else {
      redirect('/unauthorized');
    }
  }
  
  return userData;
}
