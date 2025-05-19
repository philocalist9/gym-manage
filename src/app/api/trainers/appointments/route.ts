import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Appointment from '@/app/models/Appointment';
import { verifyAuth } from '@/app/utils/auth';

// Get all appointments for the authenticated trainer
export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only trainers can access their appointments
    if (userData.role !== 'trainer') {
      return NextResponse.json(
        { error: 'Forbidden: Only trainers can access this endpoint' },
        { status: 403 }
      );
    }

    await connectDB();
    
    // Parse query parameters for filtering
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const memberId = url.searchParams.get('memberId');
    
    // Build query object
    const query: any = { trainerId: userData.id };
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }
    
    if (memberId) {
      query.memberId = memberId;
    }
    
    // Find appointments for the trainer
    const appointments = await Appointment.find(query)
      .populate('memberId', 'name email profilePicture membershipType attendance')
      .populate('gymId', 'name location')
      .sort({ date: 1, startTime: 1 });
    
    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching trainer appointments:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Create a new appointment by trainer
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only trainers can create appointments this way
    if (userData.role !== 'trainer') {
      return NextResponse.json(
        { error: 'Forbidden: Only trainers can create appointments through this endpoint' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['memberId', 'gymId', 'date', 'startTime', 'endTime', 'type'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Create new appointment with trainer ID
    const appointment = new Appointment({
      ...body,
      trainerId: userData.id,
      // Default to confirmed status since trainer is creating it
      status: body.status || 'confirmed'
    });
    
    await appointment.save();
    
    return NextResponse.json({
      message: 'Appointment created successfully',
      appointment
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Update appointment status (confirm, complete, cancel)
export async function PATCH(req: NextRequest) {
  try {
    // Verify authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only trainers can update their appointments
    if (userData.role !== 'trainer') {
      return NextResponse.json(
        { error: 'Forbidden: Only trainers can update appointments' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const body = await req.json();
    const { appointmentId, status, notes } = body;
    
    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Find and update the appointment
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      trainerId: userData.id
    });
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found or not assigned to you' },
        { status: 404 }
      );
    }
    
    // Update appointment
    appointment.status = status;
    if (notes) appointment.notes = notes;
    
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
