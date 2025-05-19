import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { verifyAuth } from '@/app/utils/auth';
import Member from '@/app/models/Member';
import Trainer from '@/app/models/Trainer';
import Gym from '@/app/models/Gym';

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || userData?.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Super admin access required' },
        { status: 403 }
      );
    }

    // Get request body
    const { userId, status } = await req.json();
    
    if (!userId || !status) {
      return NextResponse.json(
        { error: 'User ID and status are required' },
        { status: 400 }
      );
    }
    
    // Check if status is valid
    if (!['active', 'inactive', 'suspended', 'pending'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();
    
    // Try to find and update the user in each collection
    // We don't know which collection the user is in, so we try all of them
    let updated = false;
    
    // Check in Member collection
    const memberUpdate = await Member.findByIdAndUpdate(
      userId,
      { status: status.charAt(0).toUpperCase() + status.slice(1) }, // Capitalize first letter
      { new: true }
    );
    
    if (memberUpdate) {
      updated = true;
    } else {
      // Check in Trainer collection (assuming there's a status field, add it if not)
      const trainerUpdate = await Trainer.findByIdAndUpdate(
        userId,
        { status: status },
        { new: true }
      );
      
      if (trainerUpdate) {
        updated = true;
      } else {
        // Check in Gym collection
        const gymUpdate = await Gym.findByIdAndUpdate(
          userId,
          { status: status },
          { new: true }
        );
        
        if (gymUpdate) {
          updated = true;
        }
      }
    }
    
    if (!updated) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'User status updated successfully',
      status: status
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    );
  }
}
