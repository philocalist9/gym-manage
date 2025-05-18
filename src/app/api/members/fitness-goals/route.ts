import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import FitnessGoal from '@/app/models/FitnessGoal';
import Member from '@/app/models/Member';
import { verifyAuth } from '@/app/utils/auth';

// Helper function to ensure numeric values are valid
function validateNumericValue(value: any, defaultValue = 0): number {
  return typeof value === 'number' && !isNaN(value) ? value : defaultValue;
}

// This endpoint allows members to save their fitness goals
export async function POST(req: NextRequest) {
  try {
    console.log('Fitness goals POST request received');
    // Verify authentication
    const { isAuthenticated, userData } = verifyAuth(req);
    
    if (!isAuthenticated || !userData) {
      console.log('Unauthorized access attempt to fitness goals API');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only members can update their own fitness goals
    if (userData.role !== 'member') {
      return NextResponse.json(
        { error: 'Forbidden: Only members can update their fitness goals' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const body = await req.json();
    const { fitnessGoals } = body;

    console.log('Received fitness goals data:', fitnessGoals);

    if (!fitnessGoals) {
      console.log('Missing fitness goals data in request');
      return NextResponse.json(
        { error: 'Fitness goals data is required' },
        { status: 400 }
      );
    }

    // Check if the member already has fitness goals
    let existingGoals = await FitnessGoal.findOne({ memberId: userData.id });
    
    if (existingGoals) {
      // Update existing goals
      existingGoals.primaryGoal = fitnessGoals.primaryGoal || existingGoals.primaryGoal;
      existingGoals.currentWeight = validateNumericValue(fitnessGoals.currentWeight, existingGoals.currentWeight);
      existingGoals.targetWeight = validateNumericValue(fitnessGoals.targetWeight, existingGoals.targetWeight);
      existingGoals.weeklyWorkoutTarget = validateNumericValue(fitnessGoals.weeklyWorkoutTarget, existingGoals.weeklyWorkoutTarget);
      existingGoals.preferredWorkoutTime = fitnessGoals.preferredWorkoutTime || existingGoals.preferredWorkoutTime;
      existingGoals.dietaryPreferences = fitnessGoals.dietaryPreferences || existingGoals.dietaryPreferences;
      
      console.log('Updating existing fitness goals for member:', userData.id, existingGoals);
      try {
        await existingGoals.save();
        console.log('Successfully saved to FitnessGoal collection');
      } catch (saveError) {
        console.error('Error saving to FitnessGoal collection:', saveError);
        throw new Error('Failed to save fitness goals data');
      }
      
      // Also update the fitness goals in the Member document
      try {
        const member = await Member.findById(userData.id);
        if (member) {
          member.fitnessGoals = {
            primaryGoal: existingGoals.primaryGoal,
            currentWeight: validateNumericValue(existingGoals.currentWeight, 0),
            targetWeight: validateNumericValue(existingGoals.targetWeight, 0),
            weeklyWorkoutTarget: validateNumericValue(existingGoals.weeklyWorkoutTarget, 3),
            preferredWorkoutTime: existingGoals.preferredWorkoutTime,
            dietaryPreferences: Array.isArray(existingGoals.dietaryPreferences) ? existingGoals.dietaryPreferences : []
          };
          await member.save();
          console.log('Member document fitness goals also updated');
        } else {
          console.warn('Member document not found for syncing fitness goals');
        }
      } catch (memberError) {
        console.error('Error updating fitness goals in Member document:', memberError);
        // Continue execution since we already saved to the FitnessGoal collection
      }
      
      console.log('Fitness goals updated successfully');
      
      return NextResponse.json(
        { 
          message: 'Fitness goals updated successfully', 
          fitnessGoals: existingGoals 
        }, 
        { status: 200 }
      );
    } else {
      // Create new fitness goals
      const newGoals = new FitnessGoal({
        memberId: userData.id,
        primaryGoal: fitnessGoals.primaryGoal || 'General Fitness',
        currentWeight: validateNumericValue(fitnessGoals.currentWeight, 0),
        targetWeight: validateNumericValue(fitnessGoals.targetWeight, 0),
        weeklyWorkoutTarget: validateNumericValue(fitnessGoals.weeklyWorkoutTarget, 3),
        preferredWorkoutTime: fitnessGoals.preferredWorkoutTime || 'Evening',
        dietaryPreferences: fitnessGoals.dietaryPreferences || []
      });
      
      console.log('Creating new fitness goals for member:', userData.id, newGoals);
      try {
        await newGoals.save();
        console.log('Successfully saved new fitness goals to dedicated collection');
      } catch (saveError) {
        console.error('Error saving to FitnessGoal collection:', saveError);
        throw new Error('Failed to save fitness goals data');
      }
      
      // Also update the fitness goals in the Member document
      try {
        const member = await Member.findById(userData.id);
        if (member) {
          member.fitnessGoals = {
            primaryGoal: newGoals.primaryGoal,
            currentWeight: validateNumericValue(newGoals.currentWeight, 0),
            targetWeight: validateNumericValue(newGoals.targetWeight, 0),
            weeklyWorkoutTarget: validateNumericValue(newGoals.weeklyWorkoutTarget, 3),
            preferredWorkoutTime: newGoals.preferredWorkoutTime,
            dietaryPreferences: Array.isArray(newGoals.dietaryPreferences) ? newGoals.dietaryPreferences : []
          };
          await member.save();
          console.log('Member document fitness goals also created');
        } else {
          console.warn('Member document not found for syncing fitness goals');
        }
      } catch (memberError) {
        console.error('Error updating fitness goals in Member document:', memberError);
        // Continue execution since we already saved to the FitnessGoal collection
      }
      
      console.log('Fitness goals created successfully');
      
      return NextResponse.json(
        { 
          message: 'Fitness goals created successfully', 
          fitnessGoals: newGoals 
        }, 
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error('Save fitness goals error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// This endpoint allows members to retrieve their fitness goals
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

    // Only members can access their fitness goals
    if (userData.role !== 'member') {
      return NextResponse.json(
        { error: 'Forbidden: Only members can access their fitness goals' },
        { status: 403 }
      );
    }

    await connectDB();
    
    // Find fitness goals for the member from the dedicated collection
    let fitnessGoals = await FitnessGoal.findOne({ memberId: userData.id });
    
    // Also check the Member document for fitness goals
    const member = await Member.findById(userData.id);
    
    if (!fitnessGoals && member?.fitnessGoals) {
      console.log('No fitness goals found in dedicated collection, but found in Member document. Creating sync...');
      // Create a new FitnessGoal record based on Member document
      fitnessGoals = new FitnessGoal({
        memberId: userData.id,
        primaryGoal: member.fitnessGoals.primaryGoal || 'General Fitness',
        currentWeight: typeof member.fitnessGoals.currentWeight === 'number' && !isNaN(member.fitnessGoals.currentWeight) 
          ? member.fitnessGoals.currentWeight : 0,
        targetWeight: typeof member.fitnessGoals.targetWeight === 'number' && !isNaN(member.fitnessGoals.targetWeight) 
          ? member.fitnessGoals.targetWeight : 0,
        weeklyWorkoutTarget: typeof member.fitnessGoals.weeklyWorkoutTarget === 'number' && !isNaN(member.fitnessGoals.weeklyWorkoutTarget) 
          ? member.fitnessGoals.weeklyWorkoutTarget : 3,
        preferredWorkoutTime: member.fitnessGoals.preferredWorkoutTime || 'Evening',
        dietaryPreferences: member.fitnessGoals.dietaryPreferences || []
      });
      
      await fitnessGoals.save();
      console.log('Created fitness goals in dedicated collection from Member document');
    } else if (fitnessGoals && member && (!member.fitnessGoals || 
        fitnessGoals.primaryGoal !== member.fitnessGoals.primaryGoal ||
        fitnessGoals.currentWeight !== member.fitnessGoals.currentWeight ||
        fitnessGoals.targetWeight !== member.fitnessGoals.targetWeight ||
        fitnessGoals.weeklyWorkoutTarget !== member.fitnessGoals.weeklyWorkoutTarget ||
        fitnessGoals.preferredWorkoutTime !== member.fitnessGoals.preferredWorkoutTime)) {
      console.log('Syncing Member document with fitness goals from dedicated collection');
      // Update Member document with data from FitnessGoal collection
      member.fitnessGoals = {
        primaryGoal: fitnessGoals.primaryGoal,
        currentWeight: fitnessGoals.currentWeight,
        targetWeight: fitnessGoals.targetWeight,
        weeklyWorkoutTarget: fitnessGoals.weeklyWorkoutTarget,
        preferredWorkoutTime: fitnessGoals.preferredWorkoutTime,
        dietaryPreferences: fitnessGoals.dietaryPreferences
      };
      
      await member.save();
      console.log('Synced fitness goals to Member document');
    }
    
    if (!fitnessGoals) {
      return NextResponse.json(
        { 
          message: 'No fitness goals found', 
          fitnessGoals: {
            primaryGoal: 'General Fitness',
            currentWeight: 0,
            targetWeight: 0,
            weeklyWorkoutTarget: 3,
            preferredWorkoutTime: 'Evening',
            dietaryPreferences: []
          } 
        }, 
        { status: 200 }
      );
    }

    return NextResponse.json({ fitnessGoals }, { status: 200 });
  } catch (error: any) {
    console.error('Get fitness goals error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
