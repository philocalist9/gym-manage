import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Trainer from '@/app/models/Trainer';
import { verifyAuth } from '@/app/utils/auth';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only gym owners can add trainers
    if (userData.role !== 'gym-owner' && userData.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const body = await req.json();
    const { name, email, password, specialization, phone, bio, experience } = body;

    // Validate required fields
    if (!name || !email || !password || !specialization || !bio || experience === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if trainer with email already exists
    const existingTrainer = await Trainer.findOne({ email });
    if (existingTrainer) {
      return NextResponse.json(
        { error: 'A trainer with this email already exists' },
        { status: 409 }
      );
    }

    // Create new trainer
    const trainer = new Trainer({
      name,
      email,
      password, // Will be hashed by the schema pre-save hook
      specialization,
      phone,
      bio,
      experience: Number(experience),
      gymId: userData.id, // Associate trainer with the gym owner's ID
      totalClients: 0,
      rating: 5.0,
      joinDate: new Date(),
      role: 'trainer'
    });

    await trainer.save();

    // Remove password from response
    const trainerResponse = trainer.toObject();
    delete trainerResponse.password;

    return NextResponse.json(
      { message: 'Trainer added successfully', trainer: trainerResponse },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add trainer error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only gym owners and super admins can view trainers
    if (userData.role !== 'gym-owner' && userData.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectDB();
    
    // For gym owners, only show their trainers
    // For super admin, show all trainers (could be paginated in a real app)
    const query = userData.role === 'super-admin' ? {} : { gymId: userData.id };
    
    const trainers = await Trainer.find(query)
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ trainers }, { status: 200 });
  } catch (error: any) {
    console.error('Get trainers error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
