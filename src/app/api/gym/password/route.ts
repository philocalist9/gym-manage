import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/app/utils/auth';
import connectDB from '@/app/lib/mongodb';
import Gym from '@/app/models/Gym';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to database
    await connectDB();
    
    // Check if user role is gym owner
    if (userData.role !== 'gym-owner') {
      return NextResponse.json(
        { error: 'Access denied. Only gym owners can update this data' },
        { status: 403 }
      );
    }
    
    // Get update data
    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;
    
    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'All password fields are required' },
        { status: 400 }
      );
    }
    
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirmation do not match' },
        { status: 400 }
      );
    }
    
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    
    // Validate gym ID
    const gymId = userData.id;
    if (!mongoose.Types.ObjectId.isValid(gymId)) {
      return NextResponse.json(
        { error: 'Invalid gym ID format' },
        { status: 400 }
      );
    }
    
    // Find gym to update
    const gym = await Gym.findById(gymId);
    if (!gym) {
      return NextResponse.json(
        { error: 'Gym not found' },
        { status: 404 }
      );
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, gym.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    gym.password = hashedPassword;
    await gym.save();
    
    return NextResponse.json({
      message: 'Password updated successfully'
    });
    
  } catch (error: any) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
