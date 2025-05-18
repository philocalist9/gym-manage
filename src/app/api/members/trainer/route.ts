import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Member from '@/app/models/Member';
import Trainer from '@/app/models/Trainer';
import { verifyAuth } from '@/app/utils/auth';

/**
 * API endpoint for members to fetch information about their assigned trainer
 * This is more permissive than the regular trainer endpoint
 */
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
    
    // Only allow members to access this endpoint
    if (userData.role !== 'member') {
      return NextResponse.json(
        { error: 'Only members can access this endpoint' },
        { status: 403 }
      );
    }
    
    // Fetch the member data to get the trainer ID
    const member = await Member.findById(userData.id);
    
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }
    
    // Check if member has an assigned trainer
    if (!member.trainer) {
      return NextResponse.json(
        { message: 'No trainer assigned to this member', trainer: null },
        { status: 200 }
      );
    }
    
    // Fetch trainer data with gym details
    const trainer = await Trainer.findById(member.trainer)
      .select('-password')
      .populate('gymId', 'name address');
    
    if (!trainer) {
      return NextResponse.json(
        { error: 'Assigned trainer not found in the database' },
        { status: 404 }
      );
    }
    
    // Return trainer data (with limited fields for security)
    return NextResponse.json({
      trainer: {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        specialties: trainer.specialties || trainer.specialization, // handle both field names
        experience: trainer.experience,
        profileImage: trainer.profileImage,
        gymInfo: trainer.gymId // Include gym info if available through population
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error fetching trainer data:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
