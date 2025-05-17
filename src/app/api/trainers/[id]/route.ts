import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Trainer from '@/app/models/Trainer';
import { verifyAuth } from '@/app/utils/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const trainer = await Trainer.findById(params.id).select('-password');
    
    if (!trainer) {
      return NextResponse.json(
        { error: 'Trainer not found' },
        { status: 404 }
      );
    }

    // Check if the gym owner is authorized to see this trainer
    if (userData.role !== 'super-admin' && trainer.gymId.toString() !== userData.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to this trainer' },
        { status: 403 }
      );
    }

    return NextResponse.json({ trainer }, { status: 200 });
  } catch (error: any) {
    console.error('Get trainer error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only gym owners and admins can delete trainers
    if (userData.role !== 'gym-owner' && userData.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectDB();

    // Find the trainer first to check ownership
    const trainer = await Trainer.findById(params.id);
    
    if (!trainer) {
      return NextResponse.json(
        { error: 'Trainer not found' },
        { status: 404 }
      );
    }

    // Ensure the gym owner can only delete their own trainers
    if (userData.role !== 'super-admin' && trainer.gymId.toString() !== userData.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own trainers' },
        { status: 403 }
      );
    }

    // Delete the trainer
    await Trainer.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: 'Trainer deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete trainer error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only gym owners and admins can update trainers
    if (userData.role !== 'gym-owner' && userData.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const body = await req.json();
    const { name, email, specialization, phone } = body;

    // Find the trainer first to check ownership
    const trainer = await Trainer.findById(params.id);
    
    if (!trainer) {
      return NextResponse.json(
        { error: 'Trainer not found' },
        { status: 404 }
      );
    }

    // Ensure the gym owner can only update their own trainers
    if (userData.role !== 'super-admin' && trainer.gymId.toString() !== userData.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own trainers' },
        { status: 403 }
      );
    }

    // Update trainer with allowed fields
    if (name) trainer.name = name;
    if (email) trainer.email = email;
    if (specialization) trainer.specialization = specialization;
    if (phone !== undefined) trainer.phone = phone;

    // Save the updated trainer
    await trainer.save();

    // Remove password from response
    const updatedTrainer = trainer.toObject();
    delete updatedTrainer.password;

    return NextResponse.json(
      { message: 'Trainer updated successfully', trainer: updatedTrainer },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update trainer error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
