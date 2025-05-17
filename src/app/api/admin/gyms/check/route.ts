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
    
    // Get some basic stats
    const totalGyms = await Gym.countDocuments({ role: 'gym-owner' });
    const activeGyms = await Gym.countDocuments({ role: 'gym-owner', status: 'active' });
    const inactiveGyms = await Gym.countDocuments({ role: 'gym-owner', status: 'inactive' });
    const pendingGyms = await Gym.countDocuments({ role: 'gym-owner', status: 'pending' });
    
    // Get database stats
    const dbStatus = await Gym.db.stats();
    
    return NextResponse.json({
      message: 'Database connection successful',
      stats: {
        totalGyms,
        activeGyms,
        inactiveGyms,
        pendingGyms
      },
      databaseInfo: {
        collections: dbStatus.collections,
        totalDocuments: dbStatus.objects,
        avgObjSize: dbStatus.avgObjSize,
        dataSize: dbStatus.dataSize,
        dbName: Gym.db.name
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error checking database:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check database status' },
      { status: 500 }
    );
  }
}
