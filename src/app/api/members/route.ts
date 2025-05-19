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
    const { name, email, password, membershipType, trainer, status, joiningDate, nextPayment, feeAmount } = body;

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
      role: 'member',
      feeAmount: feeAmount || 1000 // Default fee amount of 1000 Indian Rupees if not provided
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
      feeAmount: member.feeAmount,
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
    
    let query = {};
    
    // For gym owners, only show their members
    if (userData.role === 'gym-owner') {
      query = { gymId: userData.id };
    } 
    // For trainers, show members from their gym
    else if (userData.role === 'trainer') {
      // Get trainer's gym ID
      const Trainer = require('@/app/models/Trainer').default;
      const trainer = await Trainer.findById(userData.id);
      
      if (!trainer || !trainer.gymId) {
        return NextResponse.json(
          { error: 'Trainer not associated with any gym' },
          { status: 404 }
        );
      }
      
      query = { gymId: trainer.gymId };
    }
    // For super admin, show all members (could be paginated in a real app)
    
    const members = await Member.find(query)
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 });
    
    console.log(`Returning ${members.length} members for ${userData.role}`);
    if (members.length > 0) {
      console.log('First member sample:', {
        id: members[0]._id,
        hasName: !!members[0].name,
        name: members[0].name,
        email: members[0].email,
        fields: Object.keys(members[0])
      });
    }
    
    // Convert Mongoose documents to plain objects to ensure all fields are properly serialized
    const plainMembers = members.map(member => {
      const plainMember = member.toObject ? member.toObject() : member;
      // Ensure name field always exists
      if (!plainMember.name) {
        plainMember.name = plainMember.email ? `${plainMember.email.split('@')[0]}` : `Client ${plainMember._id.toString().slice(-4)}`;
      }
      return plainMember;
    });
    
    return NextResponse.json({ members: plainMembers }, { status: 200 });
  } catch (error: any) {
    console.error('Get members error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
