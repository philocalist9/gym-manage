import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Gym from '@/app/models/Gym';
import { verifyAuth } from '@/app/utils/auth';

export async function GET(req: NextRequest) {
  try {
    // Verify admin auth
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if user is super admin
    if (userData.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    // Parse query parameters
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = { role: 'gym-owner' }; // Only get gym owners
    
    if (status && ['active', 'inactive', 'pending'].includes(status)) {
      query.status = status;
    }
    
    if (search) {
      // Search in multiple fields
      query.$or = [
        { gymName: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get total count for pagination
    const total = await Gym.countDocuments(query);
    
    // Fetch gyms
    const gyms = await Gym
      .find(query)
      .select('-password') // Exclude password
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({
      gyms,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error fetching gyms:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch gyms' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Verify admin auth
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if user is super admin
    if (userData.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const { gymId, status } = body;
    
    if (!gymId || !status) {
      return NextResponse.json(
        { error: 'Gym ID and status are required' },
        { status: 400 }
      );
    }
    
    if (!['active', 'inactive', 'pending'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Update gym status
    const updatedGym = await Gym.findByIdAndUpdate(
      gymId,
      { status },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedGym) {
      return NextResponse.json(
        { error: 'Gym not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Gym status updated successfully',
      gym: updatedGym
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error updating gym status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update gym status' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Verify admin auth
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if user is super admin
    if (userData.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }
    
    const url = new URL(req.url);
    const gymId = url.searchParams.get('id');
    
    if (!gymId) {
      return NextResponse.json(
        { error: 'Gym ID is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Prevent deletion of the super admin
    const gymToDelete = await Gym.findById(gymId);
    if (!gymToDelete) {
      return NextResponse.json(
        { error: 'Gym not found' },
        { status: 404 }
      );
    }
    
    if (gymToDelete.role === 'super-admin') {
      return NextResponse.json(
        { error: 'Cannot delete super admin account' },
        { status: 403 }
      );
    }
    
    // Delete the gym
    await Gym.findByIdAndDelete(gymId);
    
    return NextResponse.json({
      message: 'Gym deleted successfully'
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error deleting gym:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete gym' },
      { status: 500 }
    );
  }
}
