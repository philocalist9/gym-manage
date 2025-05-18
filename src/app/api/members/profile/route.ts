import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Member from '@/app/models/Member';
import { verifyAuth } from '@/app/utils/auth';

// This endpoint allows members to update their own profile, including fitness goals
export async function PUT(req: NextRequest) {
  try {
    // Verify authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only members can update their own profile
    if (userData.role !== 'member') {
      return NextResponse.json(
        { error: 'Forbidden: Only members can update their profile' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const body = await req.json();
    const { personalInfo, fitnessGoals } = body;

    // Find the member by their ID
    const member = await Member.findById(userData.id);
    
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Update personal information if provided
    if (personalInfo) {
      if (personalInfo.name) member.name = personalInfo.name;
      if (personalInfo.phone) member.phone = personalInfo.phone;
      // Other personal fields can be added here as needed
    }

    // Update fitness goals if provided
    if (fitnessGoals) {
      // Ensure numeric values are valid numbers or default to 0
      const currentWeight = typeof fitnessGoals.currentWeight === 'number' && !isNaN(fitnessGoals.currentWeight) 
        ? fitnessGoals.currentWeight 
        : (member.fitnessGoals?.currentWeight || 0);
      
      const targetWeight = typeof fitnessGoals.targetWeight === 'number' && !isNaN(fitnessGoals.targetWeight) 
        ? fitnessGoals.targetWeight 
        : (member.fitnessGoals?.targetWeight || 0);
      
      const weeklyWorkoutTarget = typeof fitnessGoals.weeklyWorkoutTarget === 'number' && !isNaN(fitnessGoals.weeklyWorkoutTarget) 
        ? fitnessGoals.weeklyWorkoutTarget 
        : (member.fitnessGoals?.weeklyWorkoutTarget || 0);
      
      member.fitnessGoals = {
        ...(member.fitnessGoals || {}),
        primaryGoal: fitnessGoals.primaryGoal || member.fitnessGoals?.primaryGoal || 'General Fitness',
        currentWeight,
        targetWeight,
        weeklyWorkoutTarget,
        preferredWorkoutTime: fitnessGoals.preferredWorkoutTime || member.fitnessGoals?.preferredWorkoutTime || 'Evening',
        dietaryPreferences: fitnessGoals.dietaryPreferences || member.fitnessGoals?.dietaryPreferences || []
      };
    }

    // Save the updated member profile
    await member.save();

    // Return the updated member data (excluding sensitive info)
    const updatedMember = {
      _id: member._id,
      name: member.name,
      email: member.email,
      fitnessGoals: member.fitnessGoals
    };

    return NextResponse.json(
      { 
        message: 'Profile updated successfully', 
        member: updatedMember 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update member profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// This endpoint allows members to retrieve their own profile data
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

    // Only members can access their profile data through this endpoint
    if (userData.role !== 'member') {
      return NextResponse.json(
        { error: 'Forbidden: Only members can access their profile' },
        { status: 403 }
      );
    }

    await connectDB();
    
    // Find the member by their ID
    const member = await Member.findById(userData.id)
      .select('-password'); // Exclude password field
    
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ member }, { status: 200 });
  } catch (error: any) {
    console.error('Get member profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
