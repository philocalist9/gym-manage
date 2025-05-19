import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Appointment from '@/app/models/Appointment';
import { verifyAuth } from '@/app/utils/auth';

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
      .populate('trainerId', 'name email profilePicture specialities')
      .populate('gymId', 'name location');
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // For members, they can only see their own appointments
    if (userData.role === 'member' && appointment.memberId.toString() !== userData.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only view your own appointments' },
        { status: 403 }
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

    // For members, they can only update their own appointments
    if (userData.role === 'member' && appointment.memberId.toString() !== userData.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own appointments' },
        { status: 403 }
      );
    }
    
    // For trainers, they can only update appointments assigned to them
    if (userData.role === 'trainer' && appointment.trainerId.toString() !== userData.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update appointments assigned to you' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    
    // Members can only cancel appointments or update notes
    if (userData.role === 'member') {
      if (body.status && body.status !== 'cancelled') {
        return NextResponse.json(
          { error: 'Members can only cancel appointments' },
          { status: 403 }
        );
      }
      
      // Only allow cancellations more than 3 hours before the appointment
      if (body.status === 'cancelled') {
        const appointmentDateTime = new Date(`${appointment.date.toISOString().split('T')[0]}T${appointment.startTime}:00`);
        const now = new Date();
        const diffInHours = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        if (diffInHours < 3) {
          return NextResponse.json(
            { error: 'Appointments must be cancelled at least 3 hours in advance' },
            { status: 400 }
          );
        }
      }
      
      // Update only allowed fields for members
      if (body.status) appointment.status = body.status;
      if (body.notes) appointment.notes = body.notes;
    } else if (userData.role === 'trainer') {
      // Trainers can update status and notes
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

// Delete (cancel) appointment
export async function DELETE(
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

    // For members, they can only delete their own appointments
    if (userData.role === 'member' && appointment.memberId.toString() !== userData.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own appointments' },
        { status: 403 }
      );
    }
    
    // Only allow cancellations more than 3 hours before the appointment
    const appointmentDateTime = new Date(`${appointment.date.toISOString().split('T')[0]}T${appointment.startTime}:00`);
    const now = new Date();
    const diffInHours = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 3 && userData.role === 'member') {
      return NextResponse.json(
        { error: 'Appointments must be cancelled at least 3 hours in advance' },
        { status: 400 }
      );
    }
    
    // Instead of actually deleting, mark as cancelled
    appointment.status = 'cancelled';
    await appointment.save();
    
    return NextResponse.json({ 
      message: 'Appointment cancelled successfully'
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
