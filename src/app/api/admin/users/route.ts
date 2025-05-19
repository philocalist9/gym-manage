import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { verifyAuth } from '@/app/utils/auth';
import Member from '@/app/models/Member';
import Trainer from '@/app/models/Trainer';
import Gym from '@/app/models/Gym';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  associatedGym?: string;
  lastActive?: string;
}

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || userData?.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Super admin access required' },
        { status: 403 }
      );
    }

    // Connect to the database
    await connectDB();
    
    // Fetch all users (members, trainers, and gyms)
    const [members, trainers, gyms] = await Promise.all([
      Member.find({}).lean(),
      Trainer.find({}).lean(),
      Gym.find({}).lean()
    ]);
    
    // Process members data
    const formattedMembers: UserResponse[] = members.map(member => ({
      id: member._id.toString(),
      name: member.name,
      email: member.email,
      role: 'member',
      status: member.status.toLowerCase(),
      joinDate: member.joiningDate?.toISOString().slice(0, 10) || '',
      associatedGym: member.gymId?.toString() || '',
      lastActive: new Date().toISOString() // This is a placeholder; you might want to store actual last activity
    }));
    
    // Process trainers data
    const formattedTrainers: UserResponse[] = trainers.map(trainer => ({
      id: trainer._id.toString(),
      name: trainer.name,
      email: trainer.email,
      role: 'trainer',
      status: 'active', // You may want to add a status field to your Trainer model
      joinDate: trainer.joinDate?.toISOString().slice(0, 10) || '',
      associatedGym: trainer.gymId?.toString() || '',
      lastActive: new Date().toISOString() // Placeholder
    }));
    
    // Process gyms data (gym owners)
    const formattedGyms: UserResponse[] = gyms.map(gym => ({
      id: gym._id.toString(),
      name: gym.ownerName,
      email: gym.email,
      role: 'gym_owner',
      status: gym.status,
      joinDate: gym.createdAt?.toISOString().slice(0, 10) || '',
      associatedGym: gym.gymName,
      lastActive: new Date().toISOString() // Placeholder
    }));
    
    // Combine all users
    const allUsers = [...formattedMembers, ...formattedTrainers, ...formattedGyms];
    
    return NextResponse.json({ users: allUsers }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users data' },
      { status: 500 }
    );
  }
}
