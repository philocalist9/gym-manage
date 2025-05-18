import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import BodyMeasurement from '@/app/models/BodyMeasurement';
import { verifyAuth } from '@/app/utils/auth';

// Helper function to ensure numeric values are valid
function validateNumericValue(value: any, defaultValue = 0): number {
  return typeof value === 'number' && !isNaN(value) ? value : defaultValue;
}

// This endpoint allows members to save their body measurements
export async function POST(req: NextRequest) {
  try {
    console.log('Body measurements POST request received');
    // Verify authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      console.log('Unauthorized access attempt to body measurements API');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only members can update their own body measurements
    if (userData.role !== 'member') {
      return NextResponse.json(
        { error: 'Forbidden: Only members can update their body measurements' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const body = await req.json();
    const { measurement } = body;

    console.log('Received body measurement data:', measurement);

    if (!measurement || !measurement.date) {
      console.log('Missing measurement data in request');
      return NextResponse.json(
        { error: 'Measurement data and date are required' },
        { status: 400 }
      );
    }

    const newMeasurement = new BodyMeasurement({
      memberId: userData.id,
      date: new Date(measurement.date),
      measurements: {
        chest: validateNumericValue(parseFloat(measurement.chest), 0),
        waist: validateNumericValue(parseFloat(measurement.waist), 0),
        hips: validateNumericValue(parseFloat(measurement.hips), 0),
        biceps: validateNumericValue(parseFloat(measurement.biceps), 0),
        thighs: validateNumericValue(parseFloat(measurement.thighs), 0)
      }
    });
      
    console.log('Creating new body measurement for member:', userData.id, newMeasurement);
    
    try {
      await newMeasurement.save();
      console.log('Successfully saved body measurement');
      
      return NextResponse.json(
        { 
          message: 'Body measurement saved successfully', 
          measurement: newMeasurement 
        }, 
        { status: 201 }
      );
    } catch (saveError) {
      console.error('Error saving body measurement:', saveError);
      throw new Error('Failed to save body measurement data');
    }
  } catch (error: any) {
    console.error('Save body measurement error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// This endpoint allows members to retrieve their body measurements
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

    // Only members can access their measurements
    if (userData.role !== 'member') {
      return NextResponse.json(
        { error: 'Forbidden: Only members can access their body measurements' },
        { status: 403 }
      );
    }

    await connectDB();
    
    // Extract query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '12'); // Default to last 12 measurements
    
    // Find body measurements for the member, sorted by date (newest first)
    const measurements = await BodyMeasurement.find({ memberId: userData.id })
      .sort({ date: -1 })
      .limit(limit);
    
    return NextResponse.json({ measurements }, { status: 200 });
  } catch (error: any) {
    console.error('Get body measurements error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
