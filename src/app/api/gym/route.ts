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
    
    // Parse query parameter to determine the request type
    const url = new URL(req.url);
    const getAll = url.searchParams.get('all') === 'true';
    
    // For trainers, fetch only their associated gym
    if (getAll && userData.role === 'trainer') {
      // For trainers, we only show their associated gym
      const Trainer = require('@/app/models/Trainer').default;
      const trainer = await Trainer.findById(userData.id);
      
      if (!trainer || !trainer.gymId) {
        return NextResponse.json(
          { error: 'Trainer not associated with any gym' },
          { status: 404 }
        );
      }
      
      const gym = await Gym.findById(trainer.gymId).select('_id gymName address email');
      
      if (!gym) {
        return NextResponse.json(
          { error: 'Associated gym not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        message: 'Trainer gym fetched successfully',
        gyms: [gym] // Return as array to maintain compatibility with existing code
      });
    }
    
    // For members, fetch all available gyms
    if (getAll && userData.role === 'member') {
      const gyms = await Gym.find({}).select('_id gymName address email');
      
      return NextResponse.json({
        message: 'All gyms fetched successfully',
        gyms
      });
    }
    
    // For gym owner, fetch their specific gym
    if (userData.role === 'gym-owner') {
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
    }
    
    // If not a valid role for this endpoint
    return NextResponse.json(
      { error: 'Access denied. Only gym owners, trainers, or members can access gym data' },
      { status: 403 }
    );
    
  } catch (error: any) {
    console.error('Error fetching gym data:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}