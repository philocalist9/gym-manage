import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/utils/auth';
import connectMongo from '@/app/lib/mongodb';
import ClientWorkout from '@/app/models/ClientWorkout';

/**
 * API endpoint for a member to access their workout plans
 * 
 * GET /api/members/workouts - Get all workout plans for the logged in member
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
    if (!userData || userData.role !== 'member') {
      return NextResponse.json({ error: 'Unauthorized: Access denied' }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongo();

    // Get member ID from the token
    const memberId = userData.id;
    
    // Get URL parameters for date filtering
    const url = new URL(req.url);
    const startDateParam = url.searchParams.get('startDate');
    const endDateParam = url.searchParams.get('endDate');
    
    // Build the query
    const query: {
      clientId: string;
      startDate?: { $lte: Date };
      endDate?: { $gte: Date };
    } = { clientId: memberId };
    
    // Add date filtering if provided
    if (startDateParam && endDateParam) {
      const startDate = new Date(startDateParam);
      const endDate = new Date(endDateParam);
      
      // Find workout plans that overlap with the given date range
      query.startDate = { $lte: endDate };
      query.endDate = { $gte: startDate };
    }
    
    // Fetch workout plans for this member
    const workoutPlans = await ClientWorkout.find(query)
      .populate('trainerId', 'name') // Include trainer name
      .sort({ startDate: 1 }) // Sort by start date
      .lean();
      
    return NextResponse.json({ 
      success: true, 
      workouts: workoutPlans
    });

  } catch (error) {
    console.error('Error fetching member workout plans:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
