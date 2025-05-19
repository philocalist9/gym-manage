import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Appointment from '@/app/models/Appointment';
import { verifyAuth } from '@/app/utils/auth';

// Get a specific appointment
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const appointment = await Appointment.findById(params.id)
      .populate('memberId', 'name email profilePicture membershipType attendance')
      .populate('gymId', 'name location');
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // For trainers, they can only see appointments assigned to them
    if (userData.role === 'trainer' && appointment.trainerId.toString() !== userData.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only view appointments assigned to you' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ appointment }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching appointment details:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Update an appointment's status or details
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const appointment = await Appointment.findById(params.id);
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    // For trainers, they can only update their own appointments
    if (userData.role === 'trainer' && appointment.trainerId.toString() !== userData.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update appointments assigned to you' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    
    // Trainers can update status and notes
    if (userData.role === 'trainer') {
      if (body.status) appointment.status = body.status;
      if (body.notes) appointment.notes = body.notes;
    }
    
    await appointment.save();
    
    return NextResponse.json({ 
      message: 'Appointment updated successfully',
      appointment 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
