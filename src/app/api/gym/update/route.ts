import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/app/utils/auth';
import connectDB from '@/app/lib/mongodb';
import Gym from '@/app/models/Gym';
import mongoose from 'mongoose';

export async function PUT(req: NextRequest) {
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
    const { 
      name, 
      email, 
      phone, 
      address, 
      gymName, 
      gymAddress, 
      gymPhone, 
      gymEmail 
    } = body;
    
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
    
    // Update gym data
    // Only update fields that are provided
    if (name) gym.ownerName = name;
    if (email) gym.email = email;
    if (phone) gym.phone = phone;
    if (address) gym.address = address;
    if (gymName) gym.gymName = gymName;
    
    // Save the updated gym
    await gym.save();
    
    // Return updated gym data (excluding password)
    const updatedGym = gym.toObject();
    delete updatedGym.password;
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      gym: updatedGym
    });
    
  } catch (error: any) {
    console.error('Error updating gym profile:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
