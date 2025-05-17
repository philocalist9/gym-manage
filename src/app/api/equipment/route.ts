import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Equipment from '@/app/models/Equipment';
import { verifyAuth } from '@/app/utils/auth';

// Get all equipment for a specific gym
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

    // Only gym owners and super admins can access equipment list
    if (userData.role !== 'gym-owner' && userData.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectDB();
    
    // Get query parameters
    const url = new URL(req.url);
    const gymId = url.searchParams.get('gymId');

    // If super admin, allow specifying gym ID, otherwise use the logged-in gym owner's ID
    const targetGymId = userData.role === 'super-admin' && gymId ? gymId : userData.id;
    
    // Fetch all equipment for the gym
    const equipment = await Equipment.find({ gymId: targetGymId });

    return NextResponse.json({ equipment }, { status: 200 });
  } catch (error: any) {
    console.error('Get equipment error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Add new equipment
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

    // Only gym owners and super admins can add equipment
    if (userData.role !== 'gym-owner' && userData.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const body = await req.json();
    
    // If super admin, allow specifying gym ID, otherwise use the logged-in gym owner's ID
    const gymId = userData.role === 'super-admin' && body.gymId ? body.gymId : userData.id;
    
    // Create new equipment
    const equipment = new Equipment({
      ...body,
      gymId
    });
    
    await equipment.save();

    return NextResponse.json(
      { message: 'Equipment added successfully', equipment },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add equipment error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
