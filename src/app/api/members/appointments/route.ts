import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Appointment from '@/app/models/Appointment';
import Member from '@/app/models/Member';
import Trainer from '@/app/models/Trainer';
import { verifyAuth } from '@/app/utils/auth';

// Get appointments for the authenticated member
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

    // Only members can access their appointments
    if (userData.role !== 'member') {
      return NextResponse.json(
        { error: 'Forbidden: Only members can access their appointments' },
        { status: 403 }
      );
    }

    await connectDB();
    
    // Parse query parameters for filtering
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    
    // Build query object
    const query: any = { memberId: userData.id };
    
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
    
    // Find appointments for the member
    const appointments = await Appointment.find(query)
      .populate('trainerId', 'name email profilePicture specialities')
      .sort({ date: 1, startTime: 1 });
    
    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching member appointments:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Create a new appointment
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

    // Only members can create appointments
    if (userData.role !== 'member') {
      return NextResponse.json(
        { error: 'Forbidden: Only members can create appointments' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const member = await Member.findById(userData.id);
    
    if (!member || !member.gymId) {
      return NextResponse.json(
        { error: 'Member not found or not associated with a gym' },
        { status: 404 }
      );
    }
    
    const body = await req.json();
    const { trainerId, date, startTime, endTime, type, notes } = body;
    
    if (!trainerId || !date || !startTime || !endTime || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify that the trainer exists and belongs to the member's gym
    const trainer = await Trainer.findOne({ 
      _id: trainerId, 
      gymId: member.gymId 
    });
    
    if (!trainer) {
      return NextResponse.json(
        { error: 'Trainer not found or not associated with your gym' },
        { status: 404 }
      );
    }
    
    // Validate the appointment time against trainer availability
    // (This is a basic validation, you might want to implement more complex validation)
    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];
    
    if (trainer.availability && trainer.availability[dayName]) {
      const availableSlots = trainer.availability[dayName];
      const isAvailable = availableSlots.some((slot: any) => {
        return slot.start <= startTime && slot.end >= endTime;
      });
      
      if (!isAvailable) {
        return NextResponse.json(
          { error: 'Trainer is not available at the selected time' },
          { status: 400 }
        );
      }
    }
    
    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      trainerId,
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
      },
      $or: [
        { 
          startTime: { $lt: endTime },
          endTime: { $gt: startTime } 
        }
      ],
      status: { $nin: ['cancelled'] }
    });
    
    if (conflictingAppointment) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      );
    }
    
    // Create the appointment
    const newAppointment = new Appointment({
      memberId: userData.id,
      trainerId,
      gymId: member.gymId,
      date: appointmentDate,
      startTime,
      endTime,
      type,
      notes: notes || '',
      status: 'pending' // Appointments start as pending until confirmed by the trainer
    });
    
    await newAppointment.save();
    
    // Return the created appointment
    return NextResponse.json({ 
      message: 'Appointment created successfully',
      appointment: newAppointment 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
