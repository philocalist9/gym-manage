import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Gym from '@/app/models/Gym';
import bcrypt from 'bcryptjs';
import { getSuperAdminPayload } from '@/app/utils/auth';

export async function GET(req: NextRequest) {
  try {
    // Only allow this endpoint to be accessed in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is not available in production' },
        { status: 403 }
      );
    }
    
    await connectDB();

    // Get super admin info
    const superAdminData = getSuperAdminPayload();
    
    // Check if super admin exists
    const existingAdmin = await Gym.findOne({ email: superAdminData.email });
    
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Super admin already exists', admin: { email: existingAdmin.email } },
        { status: 200 }
      );
    }
    
    // Create super admin in database
    const hashedPassword = await bcrypt.hash('Admin@2025', 10);
    
    const newSuperAdmin = new Gym({
      gymName: 'System Administrator',
      ownerName: 'Super Admin',
      address: 'System',
      email: superAdminData.email,
      phone: '0000000000',
      password: hashedPassword,
      status: 'active',
      role: 'super-admin'
    });
    
    await newSuperAdmin.save();
    
    return NextResponse.json(
      { message: 'Super admin created successfully', admin: { email: newSuperAdmin.email } },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Error seeding super admin:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seed super admin' },
      { status: 500 }
    );
  }
}
