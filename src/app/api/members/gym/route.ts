import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/app/utils/auth';
import connectDB from '@/app/lib/mongodb';
import Member from '@/app/models/Member';
import Gym from '@/app/models/Gym';

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
    
    // Fetch the member data to get the gym ID
    let member;
    try {
      if (userData.role === 'member') {
        member = await Member.findById(userData.id);
        
        if (!member) {
          return NextResponse.json(
            { error: 'Member not found' },
            { status: 404 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Only members can access this endpoint' },
          { status: 403 }
        );
      }
    } catch (memberError) {
      console.error('Error fetching member:', memberError);
      return NextResponse.json(
        { error: 'Failed to retrieve member data' },
        { status: 500 }
      );
    }
    
    // Fetch gym data using the member's gymId
    const gym = await Gym.findById(member.gymId).select('-password');
    
    if (!gym) {
      return NextResponse.json(
        { error: 'Gym not found' },
        { status: 404 }
      );
    }
    
    // Return gym data
    return NextResponse.json({
      gym: {
        id: gym._id,
        name: gym.gymName,
        address: gym.address,
        phone: gym.phone,
        email: gym.email
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching gym data:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
