import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/app/utils/auth';
import connectDB from '@/app/lib/mongodb';
import Gym from '@/app/models/Gym';
import mongoose from 'mongoose';

// Route to get gym data for the authenticated user
export async function GET(req: NextRequest) {
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
        { error: 'Access denied. Only gym owners can access this data' },
        { status: 403 }
      );
    }
    
    // Fetch gym data by ID
    const gymId = userData.id;
    
    if (!mongoose.Types.ObjectId.isValid(gymId)) {
      return NextResponse.json(
        { error: 'Invalid gym ID format' },
        { status: 400 }
      );
    }
    
    const gym = await Gym.findById(gymId).select('-password');
    
    if (!gym) {
      return NextResponse.json(
        { error: 'Gym not found' },
        { status: 404 }
      );
    }
    
    // Return gym data
    return NextResponse.json({ 
      message: 'Gym data fetched successfully',
      gym
    });
    
  } catch (error: any) {
    console.error('Error fetching gym data:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}