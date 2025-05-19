import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/utils/auth';
import connectMongo from '@/app/lib/mongodb';
import ClientWorkout from '@/app/models/ClientWorkout';

/**
 * API endpoint for a trainer to manage workout plans
 * 
 * POST /api/trainers/workouts - Create a new workout plan
 * GET /api/trainers/workouts - Get all workout plans for a trainer
 * GET /api/trainers/workouts?clientId=xyz - Get workout plans for a specific client
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
    if (!userData || userData.role !== 'trainer') {
      return NextResponse.json({ error: 'Unauthorized: Access denied' }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongo();

    // Get trainer ID from the token
    const trainerId = userData.id;
    
    // Parse the request body
    const workoutData = await req.json();
    
    // Basic validation
    if (!workoutData.clientId || !workoutData.days || !workoutData.planName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if at least one day has exercises
    const hasExercises = workoutData.days.some((day: any) => day.exercises && day.exercises.length > 0);
    if (!hasExercises) {
      return NextResponse.json({ error: 'Workout plan must have at least one exercise' }, { status: 400 });
    }

    // Create a new workout plan
    const workoutPlan = await ClientWorkout.create({
      ...workoutData,
      trainerId,
      startDate: new Date(workoutData.startDate),
      endDate: new Date(workoutData.endDate)
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Workout plan created successfully',
      workout: workoutPlan
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating workout plan:', error);
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
    if (!userData || userData.role !== 'trainer') {
      return NextResponse.json({ error: 'Unauthorized: Access denied' }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongo();

    // Get trainer ID from the token
    const trainerId = userData.id;
    
    // Get URL parameters
    const url = new URL(req.url);
    const clientId = url.searchParams.get('clientId');
    
    // Build the query
    const query: any = { trainerId };
    if (clientId) {
      query.clientId = clientId;
    }
    
    // Fetch workout plans
    const workoutPlans = await ClientWorkout.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(100) // Limit to 100 entries
      .lean();
      
    return NextResponse.json({ 
      success: true, 
      workouts: workoutPlans
    });

  } catch (error) {
    console.error('Error fetching workout plans:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
