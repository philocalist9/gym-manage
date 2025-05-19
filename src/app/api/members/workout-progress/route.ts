import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/utils/auth';
import connectMongo from '@/app/lib/mongodb';
import mongoose from 'mongoose';
import WorkoutProgress from '@/app/models/WorkoutProgress';

/**
 * API endpoint for workout progress tracking
 * 
 * POST /api/members/workout-progress - Save workout progress
 * GET /api/members/workout-progress - Get workout progress
 */
export async function POST(req: NextRequest) {
  try {
    // Get the token from the request cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // Verify the token and get user data
    const userData = verifyToken(token);
    if (!userData || userData.role !== 'member') {
      return NextResponse.json({ error: 'Unauthorized: Access denied' }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongo();

    // Get member ID from the token
    const memberId = userData.id;
    
    // Parse the request body
    const progressData = await req.json();
    
    console.log('Received progress data:', progressData);
    
    // Basic validation
    if (!progressData.planId || !progressData.date || !progressData.exercises) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let result;
    try {
      // Convert planId to ObjectId if it's not already
      const planId = typeof progressData.planId === 'string' ? 
        new mongoose.Types.ObjectId(progressData.planId) : progressData.planId;
      
      // Check if progress already exists for this plan and date
      const existingProgress = await WorkoutProgress.findOne({
        memberId,
        planId: planId,
        date: new Date(progressData.date)
      });
  
      if (existingProgress) {
        console.log('Updating existing progress:', existingProgress._id);
        // Update existing progress
        result = await WorkoutProgress.findByIdAndUpdate(
          existingProgress._id,
          {
            $set: {
              exercises: progressData.exercises,
              completed: progressData.completed,
              day: progressData.day
            }
          },
          { new: true }
        );
      } else {
        console.log('Creating new progress entry');
        // Create new progress entry
        result = await WorkoutProgress.create({
          memberId,
          planId: planId,
          date: new Date(progressData.date),
          day: progressData.day,
          exercises: progressData.exercises,
          completed: progressData.completed
        });
      }
    } catch (err) {
      console.error('Database operation error:', err);
      return NextResponse.json({ 
        error: 'Database error',
        details: err instanceof Error ? err.message : 'Unknown database error'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Workout progress saved successfully',
      progress: result
    });

  } catch (error) {
    console.error('Error saving workout progress:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get the token from the request cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // Verify the token and get user data
    const userData = verifyToken(token);
    if (!userData || userData.role !== 'member') {
      return NextResponse.json({ error: 'Unauthorized: Access denied' }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongo();

    // Get member ID from the token
    const memberId = userData.id;
    
    // Get URL parameters
    const url = new URL(req.url);
    const planId = url.searchParams.get('planId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    
    // Build the query
    const query: any = { memberId };
    
    if (planId) {
      query.planId = planId;
    }
    
    // Add date filtering if provided
    if (startDate && endDate) {
      // Set time to beginning and end of day for accurate comparison
      const startDateObj = new Date(startDate);
      startDateObj.setHours(0, 0, 0, 0);
      
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      
      query.date = {
        $gte: startDateObj,
        $lte: endDateObj
      };
    } else if (startDate) {
      const startDateObj = new Date(startDate);
      startDateObj.setHours(0, 0, 0, 0);
      query.date = { $gte: startDateObj };
    } else if (endDate) {
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      query.date = { $lte: endDateObj };
    }
    
    console.log('Fetching progress with query:', query);
    
    // Fetch workout progress
    const progress = await WorkoutProgress.find(query)
      .populate('planId', 'planName')
      .sort({ date: -1 })
      .lean();
      
    return NextResponse.json({ 
      success: true, 
      progress
    });

  } catch (error) {
    console.error('Error fetching workout progress:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
