import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Gym from '@/app/models/Gym';
import bcrypt from 'bcryptjs';
import { verifyAuth } from '@/app/utils/auth';

// Sample gym data generator
const generateSampleGyms = (count: number) => {
  const gyms = [];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
  const gymTypes = ['Fitness', 'CrossFit', 'Yoga', 'Powerlifting', 'Boxing', 'Mixed Martial Arts'];
  
  for (let i = 0; i < count; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const type = gymTypes[Math.floor(Math.random() * gymTypes.length)];
    const id = i + 1;
    
    gyms.push({
      gymName: `${city} ${type} Gym ${id}`,
      ownerName: `Owner ${id}`,
      address: `${Math.floor(1000 + Math.random() * 9000)} Main St, ${city}, USA`,
      email: `gym${id}@example.com`,
      phone: `(${Math.floor(100 + Math.random() * 900)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      password: 'Password123', // Would be hashed in real implementation
      status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
      role: 'gym-owner',
    });
  }
  
  return gyms;
};

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
    
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is not available in production' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    // Parse count from query parameters
    const url = new URL(req.url);
    const count = parseInt(url.searchParams.get('count') || '10');
    const clearExisting = url.searchParams.get('clear') === 'true';
    
    // Clear existing gyms if requested (except super-admin)
    if (clearExisting) {
      await Gym.deleteMany({ role: { $ne: 'super-admin' } });
    }
    
    // Generate and save sample gyms
    const sampleGyms = generateSampleGyms(count);
    
    // Hash passwords
    for (const gym of sampleGyms) {
      gym.password = await bcrypt.hash(gym.password, 10);
    }
    
    // Insert gyms
    const result = await Gym.insertMany(sampleGyms);
    
    return NextResponse.json({
      message: `Successfully seeded ${result.length} gyms`,
      gymsCreated: result.length
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error seeding gyms:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seed gyms' },
      { status: 500 }
    );
  }
}
