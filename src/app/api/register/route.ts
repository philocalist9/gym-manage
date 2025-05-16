import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/app/lib/mongodb';
import Gym from '@/app/models/Gym';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { gymName, ownerName, address, email, phone, password } = body;

    // Check if gym already exists with this email
    const existingGym = await Gym.findOne({ email });
    if (existingGym) {
      return NextResponse.json(
        { error: 'A gym with this email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new gym
    const newGym = await Gym.create({
      gymName,
      ownerName,
      address,
      email,
      phone,
      password: hashedPassword,
    });

    // Remove password from response
    const gym = newGym.toObject();
    delete gym.password;

    return NextResponse.json(
      { message: 'Gym registered successfully', gym },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
