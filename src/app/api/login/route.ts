import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/app/lib/mongodb';
import Gym from '@/app/models/Gym';
import { createToken, setAuthCookie } from '@/app/utils/auth';

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

    // Find gym by email
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

    // Create payload for token
    const tokenPayload = { 
      id: gym._id.toString(),
      email: gym.email,
      gymName: gym.gymName,
      role: 'gym-owner'  // Set the role for authorization
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