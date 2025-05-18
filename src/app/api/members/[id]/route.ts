import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Member from '@/app/models/Member';
import { verifyAuth } from '@/app/utils/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    await connectDB();

    const member = await Member.findById(id).select('-password');

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Check if the user has permission to view this member
    if (userData.role === 'member' && userData.id !== id) {
      // Members can only view their own data
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to view this member' },
        { status: 403 }
      );
    } else if (userData.role === 'gym-owner' && userData.id !== member.gymId.toString()) {
      // Gym owners can only view members in their gym
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to view this member' },
        { status: 403 }
      );
    } else if (userData.role !== 'super-admin' && userData.role !== 'member' && userData.role !== 'gym-owner') {
      // Other roles (besides super-admin) cannot view member data
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to view this member' },
        { status: 403 }
      );
    }

    return NextResponse.json({ member }, { status: 200 });
  } catch (error: any) {
    console.error('Get member error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await req.json();

    await connectDB();

    const member = await Member.findById(id);

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Check if the user has permission to update this member
    if (userData.role !== 'super-admin' && userData.id !== member.gymId.toString()) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to update this member' },
        { status: 403 }
      );
    }

    // Don't allow direct updates to the password, gymId, or role
    const { password, gymId, role, ...updateData } = body;

    const updatedMember = await Member.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    return NextResponse.json(
      { 
        message: 'Member updated successfully', 
        member: updatedMember 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update member error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    await connectDB();

    const member = await Member.findById(id);

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Check if the user has permission to delete this member
    if (userData.role !== 'super-admin' && userData.id !== member.gymId.toString()) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to delete this member' },
        { status: 403 }
      );
    }

    await Member.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Member deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete member error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
