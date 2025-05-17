import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Gym from '@/app/models/Gym';
import { verifyAuth } from '@/app/utils/auth';

export async function GET(req: NextRequest) {
  try {
    console.log("GET /api/admin/gyms - Start of request");
    
    // Verify admin auth
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      console.log("GET /api/admin/gyms - Authentication failed");
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if user is super admin
    if (userData.role !== 'super-admin') {
      console.log("GET /api/admin/gyms - Unauthorized access, role:", userData.role);
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }
    
    console.log("GET /api/admin/gyms - Connecting to database");
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
    console.log(`GET /api/admin/gyms - Executing query:`, query);
    const gyms = await Gym
      .find(query)
      .select('-password') // Exclude password
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limit);
    
    console.log(`GET /api/admin/gyms - Found ${gyms.length} gyms`);
    
    const paginationData = {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
    
    console.log(`GET /api/admin/gyms - Pagination:`, paginationData);
    
    return NextResponse.json({
      gyms,
      pagination: paginationData
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error fetching gyms:', error);
    
    // Enhanced error reporting
    let errorMessage = error.message || 'Failed to fetch gyms';
    let errorDetails = null;
    
    // Check for MongoDB connection errors
    if (error.name === 'MongoNetworkError' || 
        error.message.includes('ECONNREFUSED') || 
        error.message.includes('connect ETIMEDOUT')) {
      errorMessage = 'Database connection error. Please check your MongoDB connection.';
      errorDetails = {
        type: 'connection',
        original: error.message
      };
    } 
    // Check for authentication errors
    else if (error.message.includes('Authentication failed') || 
             error.message.includes('not authorized')) {
      errorMessage = 'Database authentication failed. Please check your credentials.';
      errorDetails = {
        type: 'authentication',
        original: error.message
      };
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
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
    const { gymId, status, updates } = body;
    
    if (!gymId) {
      return NextResponse.json(
        { error: 'Gym ID is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Prepare update object
    const updateData: any = {};
    
    // Handle status update
    if (status && ['active', 'inactive', 'pending'].includes(status)) {
      updateData.status = status;
    }
    
    // Handle other field updates
    if (updates) {
      // Only update fields that are provided and validate them
      if (updates.gymName) updateData.gymName = updates.gymName;
      if (updates.ownerName) updateData.ownerName = updates.ownerName;
      if (updates.address) updateData.address = updates.address;
      if (updates.email) {
        // Basic email validation
        if (!/\S+@\S+\.\S+/.test(updates.email)) {
          return NextResponse.json(
            { error: 'Invalid email format' },
            { status: 400 }
          );
        }
        updateData.email = updates.email;
      }
      if (updates.phone) updateData.phone = updates.phone;
    }
    
    // If no updates provided
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      );
    }
    
    console.log(`PUT /api/admin/gyms - Updating gym ${gymId} with:`, updateData);
    
    // Update gym
    const updatedGym = await Gym.findByIdAndUpdate(
      gymId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedGym) {
      return NextResponse.json(
        { error: 'Gym not found' },
        { status: 404 }
      );
    }
    
    const updateMessage = status ? 'status' : 'information';
    
    return NextResponse.json({
      message: `Gym ${updateMessage} updated successfully`,
      gym: updatedGym
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error updating gym:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update gym' },
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
