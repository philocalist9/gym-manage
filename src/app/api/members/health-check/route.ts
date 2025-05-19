import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/utils/auth';
import connectMongo from '@/app/lib/mongodb';
import HealthCheckIn from '@/app/models/HealthCheckIn';
import mongoose from 'mongoose';

/**
 * API endpoint for member health check-ins
 * 
 * POST /api/members/health-check - Save a health check-in
 * GET /api/members/health-check - Get health check-in history
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
    const healthData = await req.json();
    
    // Validate required fields
    if (!healthData.date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }
    
    try {
      // Format the date properly by setting to midnight in user's timezone
      const checkInDate = new Date(healthData.date);
      checkInDate.setHours(0, 0, 0, 0);

      // Check if an entry already exists for this date
      const existingEntry = await HealthCheckIn.findOne({
        memberId,
        date: {
          $gte: checkInDate,
          $lt: new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      let result;
      
      if (existingEntry) {
        // Update existing entry
        result = await HealthCheckIn.findByIdAndUpdate(
          existingEntry._id,
          {
            $set: {
              weight: healthData.weight,
              sleepHours: healthData.sleepHours,
              stressLevel: healthData.stressLevel,
              mood: healthData.mood,
              energyLevel: healthData.energyLevel,
              waterIntake: healthData.waterIntake,
              nutritionQuality: healthData.nutritionQuality,
              soreness: healthData.soreness,
              notes: healthData.notes
            }
          },
          { new: true }
        );
      } else {
        // Create a new health check-in
        result = await HealthCheckIn.create({
          memberId,
          date: checkInDate,
          weight: healthData.weight,
          sleepHours: healthData.sleepHours,
          stressLevel: healthData.stressLevel,
          mood: healthData.mood,
          energyLevel: healthData.energyLevel,
          waterIntake: healthData.waterIntake,
          nutritionQuality: healthData.nutritionQuality,
          soreness: healthData.soreness,
          notes: healthData.notes
        });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: existingEntry ? 'Health check-in updated successfully' : 'Health check-in saved successfully',
        healthCheckIn: result
      });
      
    } catch (err) {
      console.error('Database operation error:', err);
      return NextResponse.json({ 
        error: 'Database error',
        details: err instanceof Error ? err.message : 'Unknown database error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving health check-in:', error);
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
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const limit = parseInt(url.searchParams.get('limit') || '30', 10);
    
    // Build the query
    const query: any = { memberId };
    
    // Add date filtering if provided
    if (startDate && endDate) {
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
    
    // Fetch health check-ins
    const healthCheckIns = await HealthCheckIn.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .lean();
      
    return NextResponse.json({ 
      success: true, 
      healthCheckIns
    });
  } catch (error) {
    console.error('Error fetching health check-ins:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
