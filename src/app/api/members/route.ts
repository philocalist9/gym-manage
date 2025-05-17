import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Member from '@/app/models/Member';
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

    // Only gym owners can add members
    if (userData.role !== 'gym-owner' && userData.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const body = await req.json();
    const { name, email, password, membershipType, trainer, status, joiningDate, nextPayment } = body;

    // Validate required fields
    if (!name || !email || !password || !membershipType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if member with email already exists
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return NextResponse.json(
        { error: 'A member with this email already exists' },
        { status: 409 }
      );
    }

    // Create new member
    const member = new Member({
      name,
      email,
      password,
      membershipType,
      trainer: trainer || null,
      status: status || 'Active',
      joiningDate: joiningDate || new Date(),
      nextPayment: nextPayment || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
      attendance: 100,
      gymId: userData.id, // Set the gym ID from the logged-in user
      role: 'member'
    });

    await member.save();
    
    // Return the member without the password
    const memberWithoutPassword = {
      _id: member._id,
      name: member.name,
      email: member.email,
      memberNumber: member.memberNumber,
      membershipType: member.membershipType,
      status: member.status,
      joiningDate: member.joiningDate,
      nextPayment: member.nextPayment,
      trainer: member.trainer,
      attendance: member.attendance,
    };

    return NextResponse.json(
      { 
        message: 'Member created successfully', 
        member: memberWithoutPassword 
      }, 
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create member error:', error);
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

    await connectDB();
    
    // For gym owners, only show their members
    // For super admin, show all members (could be paginated in a real app)
    const query = userData.role === 'super-admin' ? {} : { gymId: userData.id };
    
    const members = await Member.find(query)
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ members }, { status: 200 });
  } catch (error: any) {
    console.error('Get members error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
