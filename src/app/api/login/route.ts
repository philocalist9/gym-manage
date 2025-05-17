import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/app/lib/mongodb';
import Gym from '@/app/models/Gym';
import Trainer from '@/app/models/Trainer';
import { createToken, setAuthCookie, isSuperAdminCredentials, getSuperAdminPayload } from '@/app/utils/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { email, password, role = 'gym-owner' } = body;

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

    // Determine which model to use based on role
    let user;
    let userRole;

    // Check if login is for a trainer
    if (role === 'trainer') {
      user = await Trainer.findOne({ email });
      userRole = 'trainer';
    } else {
      // Default to gym owner
      user = await Gym.findOne({ email });
      userRole = 'gym-owner';
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // For gym owners, check status - only allow active accounts to log in
    if (userRole === 'gym-owner' && user.status !== 'active') {
      const statusMessage = user.status === 'pending' 
        ? 'Your account is pending approval by the administrator.' 
        : 'Your account has been deactivated. Please contact the administrator.';
      
      return NextResponse.json(
        { error: statusMessage, accountStatus: user.status },
        { status: 403 }
      );
    }

    // Create payload for token
    const tokenPayload = { 
      id: user._id.toString(),
      email: user.email,
      gymName: userRole === 'trainer' ? user.name : user.gymName,
      role: userRole
    };
    
    // Create JWT token
    const token = createToken(tokenPayload);

    // Remove sensitive data from response
    const userData = user.toObject();
    delete userData.password;

    // Create response
    const response = NextResponse.json(
      { 
        message: 'Login successful', 
        user: userData,
        role: userRole
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