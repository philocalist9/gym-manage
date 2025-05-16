import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/app/lib/mongodb';
import Gym from '@/app/models/Gym';

const JWT_SECRET = process.env.JWT_SECRET || 'gymsync-secure-jwt-token';

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

    // Create JWT token
    const token = jwt.sign(
      { 
        id: gym._id,
        email: gym.email,
        gymName: gym.gymName,
        role: 'gym-owner'  // Set the role for authorization
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove sensitive data from response
    const gymData = gym.toObject();
    delete gymData.password;

    // Set cookie with JWT token
    const response = NextResponse.json(
      { 
        message: 'Login successful', 
        gym: gymData,
        role: 'gym-owner'
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}