import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/utils/auth';
import connectMongo from '@/app/lib/mongodb';
import Member from '@/app/models/Member';
import Appointment, { IAppointment } from '@/app/models/Appointment';

/**
 * API endpoint for a trainer to get members who have appointments with them
 * GET /api/trainers/clients
 */
export async function GET(req: NextRequest) {
  try {
    // Get the token from the request cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // Verify the token and get user data
    const userData = verifyToken(token);
    if (!userData || userData.role !== 'trainer') {
      return NextResponse.json({ error: 'Unauthorized: Access denied' }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongo();

    // Get trainer ID from the token
    const trainerId = userData.id;

    // Find all appointments for this trainer
    const appointments = await Appointment.find({ 
      trainerId: trainerId,
      status: { $nin: ['cancelled'] } // Exclude cancelled appointments
    }).lean();

    // Get unique member IDs from appointments
    const appointmentMemberIds = appointments.map(appointment => 
      appointment.memberId ? appointment.memberId.toString() : null
    ).filter(id => id !== null); // Filter out null values
    
    // Get all assigned members (members who have this trainer as their trainer)
    const assignedMembers = await Member.find({
      trainer: trainerId
    }).lean();
    
    // Get IDs of assigned members
    const assignedMemberIds = assignedMembers.map(member => 
      member._id ? member._id.toString() : null
    ).filter(id => id !== null); // Filter out null values

    // Combine both lists without duplicates
    const allMemberIds = [...new Set([...appointmentMemberIds, ...assignedMemberIds])];

    // If we have no members at all, return an empty array early
    if (allMemberIds.length === 0) {
      return NextResponse.json({ clients: [] });
    }

    // Find all members who have appointments with or are assigned to this trainer
    const members = await Member.find({
      _id: { $in: allMemberIds }
    }).lean();

    // Create a set of assigned member IDs for quick lookup
    const assignedMemberIdSet = new Set(assignedMemberIds);
    
    // For each member, find their next appointment with this trainer
    const clientsWithAppointments = await Promise.all(members.map(async (member) => {
      const memberId = member._id;
      
      // Find the next appointment for this member with this trainer
      const nextAppointment = await Appointment.findOne({
        memberId: memberId,
        trainerId: trainerId,
        date: { $gte: new Date() },
        status: { $nin: ['cancelled', 'completed'] }
      }).sort({ date: 1, startTime: 1 }).lean();
      
      // Cast to appropriate type - the lean() method returns a plain JavaScript object, not a Document
      const typedNextAppointment = nextAppointment as unknown as IAppointment;

      // Find total number of completed sessions
      const completedSessions = await Appointment.countDocuments({
        memberId: memberId,
        trainerId: trainerId,
        status: 'completed'
      });
      
      // Find total number of upcoming sessions
      const upcomingSessions = await Appointment.countDocuments({
        memberId: memberId,
        trainerId: trainerId,
        date: { $gte: new Date() },
        status: { $nin: ['cancelled', 'completed'] }
      });
      
      // Check if this member is formally assigned to this trainer
      const isAssigned = member.trainer ? 
        member.trainer.toString() === trainerId.toString() : 
        assignedMemberIdSet.has((memberId as string));
      
      // Last workout date (most recent completed appointment)
      const lastWorkout = await Appointment.findOne({
        memberId: memberId,
        trainerId: trainerId,
        status: 'completed'
      }).sort({ date: -1 }).lean();
      
      // Cast to appropriate type
      const typedLastWorkout = lastWorkout as unknown as IAppointment;

      // Return member data with next appointment and session counts
      return {
        _id: memberId,
        name: member.name,
        email: member.email,
        membershipType: member.membershipType,
        status: member.status,
        joiningDate: member.joiningDate,
        nextAppointment: typedNextAppointment ? {
          date: typedNextAppointment.date,
          startTime: typedNextAppointment.startTime,
          type: typedNextAppointment.type,
          status: typedNextAppointment.status
        } : null,
        lastWorkout: typedLastWorkout ? {
          date: typedLastWorkout.date,
          type: typedLastWorkout.type
        } : null,
        fitnessGoals: member.fitnessGoals,
        isAssigned: isAssigned,
        sessionStats: {
          completed: completedSessions,
          upcoming: upcomingSessions,
          total: completedSessions + upcomingSessions
        }
      };
    }));

    return NextResponse.json({ clients: clientsWithAppointments });
  } catch (error) {
    console.error('Error fetching trainer clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}