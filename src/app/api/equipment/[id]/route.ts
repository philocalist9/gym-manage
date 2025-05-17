import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Equipment from '@/app/models/Equipment';
import { verifyAuth } from '@/app/utils/auth';

// Get a specific equipment item
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
    
    const equipment = await Equipment.findById(params.id);
    
    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to view this equipment
    if (userData.role !== 'super-admin' && equipment.gymId.toString() !== userData.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to this equipment' },
        { status: 403 }
      );
    }

    return NextResponse.json({ equipment }, { status: 200 });
  } catch (error: any) {
    console.error('Get equipment error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Update equipment
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

    await connectDB();
    
    const body = await req.json();
    
    // Find the equipment to update and check ownership
    const equipment = await Equipment.findById(params.id);
    
    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to update this equipment
    if (userData.role !== 'super-admin' && equipment.gymId.toString() !== userData.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own equipment' },
        { status: 403 }
      );
    }

    // Update equipment
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { message: 'Equipment updated successfully', equipment: updatedEquipment },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update equipment error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Delete equipment
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

    await connectDB();
    
    // Find the equipment to delete and check ownership
    const equipment = await Equipment.findById(params.id);
    
    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to delete this equipment
    if (userData.role !== 'super-admin' && equipment.gymId.toString() !== userData.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own equipment' },
        { status: 403 }
      );
    }

    // Delete equipment
    await Equipment.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: 'Equipment deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete equipment error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
