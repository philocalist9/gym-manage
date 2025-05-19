import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Trainer from '@/app/models/Trainer';
import Member from '@/app/models/Member';
import { verifyAuth } from '@/app/utils/auth';

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

    // Only members can access this endpoint
    if (userData.role !== 'member') {
      return NextResponse.json(
        { error: 'Forbidden: Only members can access this endpoint' },
        { status: 403 }
      );
    }

    await connectDB();
    
    // Get the member's gym ID
    const member = await Member.findById(userData.id);
    
    if (!member || !member.gymId) {
      return NextResponse.json(
        { error: 'Member not found or not associated with a gym' },
        { status: 404 }
      );
    }

    // Find all trainers in the member's gym
    const trainers = await Trainer.find({ gymId: member.gymId })
      .select('_id name email specialities availability profilePicture bio rating')
      .sort({ name: 1 });
    
    // Return the trainers list
    return NextResponse.json({ trainers }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching gym trainers:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
