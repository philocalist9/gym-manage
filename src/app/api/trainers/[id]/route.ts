import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Trainer from '@/app/models/Trainer';
import { verifyAuth } from '@/app/utils/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    console.log(`Fetching trainer with ID: ${params.id}, requested by user role: ${userData.role}, user ID: ${userData.id}`);
    
    // Populate the gym data to get access to gym name and address
    const trainer = await Trainer.findById(params.id)
      .select('-password')
      .populate('gymId', 'name address phone email');
    
    if (!trainer) {
      console.log(`Trainer with ID ${params.id} not found`);
      return NextResponse.json(
        { error: 'Trainer not found' },
        { status: 404 }
      );
    }

    // Check if the user is authorized to see this trainer
    // Allow access if: 
    // 1) user is super-admin
    // 2) user is the gym owner of this trainer 
    // 3) user is the trainer themselves
    // 4) user is a member with this trainer assigned to them
    if (userData.role === 'member') {
      // For members, we need to check if this trainer is assigned to them
      try {
        const Member = require('@/app/models/Member').default;
        const member = await Member.findById(userData.id);
        
        // Allow access if this trainer is assigned to the member
        // Use string comparison to avoid ObjectID comparison issues
        const memberTrainerId = member?.trainer ? member.trainer.toString() : null;
        const requestedTrainerId = params.id;
        
        console.log('Member trainer check:', {
          memberTrainerId,
          requestedTrainerId,
          match: memberTrainerId === requestedTrainerId
        });
        
        if (member && memberTrainerId && memberTrainerId === requestedTrainerId) {
          // This is the member's assigned trainer - allow access
          console.log('Access granted: Member is accessing their assigned trainer');
        } else {
          console.log('Access denied: Not the member\'s assigned trainer');
          return NextResponse.json(
            { error: 'Forbidden: This is not your assigned trainer' },
            { status: 403 }
          );
        }
      } catch (memberError) {
        console.error('Error checking member-trainer relationship:', memberError);
        return NextResponse.json(
          { error: 'Could not verify trainer-member relationship' },
          { status: 500 }
        );
      }
    } else if (userData.role !== 'super-admin' && 
        trainer.gymId.toString() !== userData.id && 
        trainer._id.toString() !== userData.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to this trainer' },
        { status: 403 }
      );
    }

    return NextResponse.json({ trainer }, { status: 200 });
  } catch (error: any) {
    console.error('Get trainer error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only gym owners and admins can delete trainers
    if (userData.role !== 'gym-owner' && userData.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectDB();

    // Find the trainer first to check ownership
    const trainer = await Trainer.findById(params.id);
    
    if (!trainer) {
      return NextResponse.json(
        { error: 'Trainer not found' },
        { status: 404 }
      );
    }

    // Ensure the gym owner can only delete their own trainers
    if (userData.role !== 'super-admin' && trainer.gymId.toString() !== userData.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own trainers' },
        { status: 403 }
      );
    }

    // Delete the trainer
    await Trainer.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: 'Trainer deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete trainer error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Allow updates if user is: 1) a super-admin, 2) a gym owner, or 3) the trainer themselves
    const allowedToUpdate = 
      userData.role === 'super-admin' || 
      userData.role === 'gym-owner' || 
      (userData.role === 'trainer' && userData.id === params.id);
    
    if (!allowedToUpdate) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const body = await req.json();
    const { name, email, specialization, phone, bio, experience, gymName, gymAddress } = body;

    // Find the trainer first to check ownership
    const trainer = await Trainer.findById(params.id);
    
    if (!trainer) {
      return NextResponse.json(
        { error: 'Trainer not found' },
        { status: 404 }
      );
    }

    // Ensure appropriate permissions for updating
    const isSuperAdmin = userData.role === 'super-admin';
    const isGymOwnerWithRights = userData.role === 'gym-owner' && trainer.gymId.toString() === userData.id;
    const isTrainerSelf = userData.role === 'trainer' && trainer._id.toString() === userData.id;
    
    if (!isSuperAdmin && !isGymOwnerWithRights && !isTrainerSelf) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own profile or trainers' },
        { status: 403 }
      );
    }

    // Update trainer with allowed fields
    if (name) trainer.name = name;
    if (email) trainer.email = email;
    if (specialization) trainer.specialization = specialization;
    if (phone !== undefined) trainer.phone = phone;

    // Save the updated trainer
    await trainer.save();

    // Remove password from response
    const updatedTrainer = trainer.toObject();
    delete updatedTrainer.password;

    return NextResponse.json(
      { message: 'Trainer updated successfully', trainer: updatedTrainer },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update trainer error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
