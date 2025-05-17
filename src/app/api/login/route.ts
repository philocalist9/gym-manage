import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/app/lib/mongodb';
import Gym from '@/app/models/Gym';
import { createToken, setAuthCookie, isSuperAdminCredentials, getSuperAdminPayload } from '@/app/utils/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check for super admin credentials
    if (isSuperAdminCredentials(email, password)) {
      // Super admin authentication - bypasses database check
      const superAdminPayload = getSuperAdminPayload();
      
      // Create token with super admin flag for shorter expiration
      const token = createToken(superAdminPayload, true);
      
      // Create response
      const response = NextResponse.json(
        { 
          message: 'Login successful', 
          gym: {
            _id: superAdminPayload.id,
            email: superAdminPayload.email,
            gymName: superAdminPayload.gymName,
            role: superAdminPayload.role,
            createdAt: new Date().toISOString()
          },
          role: superAdminPayload.role
        },
        { status: 200 }
      );
      
      // Set auth cookie with super admin flag for shorter expiration
      setAuthCookie(response, token, true);
      
      return response;
    }

    // Regular user flow - Find gym by email
    const gym = await Gym.findOne({ email });
    if (!gym) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, gym.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // For gym owners, check status - only allow active accounts to log in
    if (gym.role === 'gym-owner' && gym.status !== 'active') {
      const statusMessage = gym.status === 'pending' 
        ? 'Your account is pending approval by the administrator.' 
        : 'Your account has been deactivated. Please contact the administrator.';
      
      return NextResponse.json(
        { error: statusMessage, accountStatus: gym.status },
        { status: 403 }
      );
    }

    // Create payload for token
    const tokenPayload = { 
      id: gym._id.toString(),
      email: gym.email,
      gymName: gym.gymName,
      role: gym.role || 'gym-owner'  // Set the role for authorization, with fallback
    };
    
    // Create JWT token
    const token = createToken(tokenPayload);

    // Remove sensitive data from response
    const gymData = gym.toObject();
    delete gymData.password;

    // Create response
    const response = NextResponse.json(
      { 
        message: 'Login successful', 
        gym: gymData,
        role: 'gym-owner'
      },
      { status: 200 }
    );

    // Set auth cookie
    setAuthCookie(response, token);

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}