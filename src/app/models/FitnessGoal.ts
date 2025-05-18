import mongoose, { Schema, Document } from 'mongoose';

export interface IFitnessGoal extends Document {
  memberId: mongoose.Types.ObjectId | string;
  primaryGoal: string;
  currentWeight: number;
  targetWeight: number;
  weeklyWorkoutTarget: number;
  preferredWorkoutTime: string;
  dietaryPreferences: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FitnessGoalSchema: Schema = new Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
    index: true
  },
  primaryGoal: {
    type: String,
    enum: ['Weight Loss', 'Muscle Gain', 'Strength Training', 'General Fitness'],
    default: 'General Fitness'
  },
  currentWeight: {
    type: Number,
    min: 0,
    default: 0
  },
  targetWeight: {
    type: Number,
    min: 0,
    default: 0
  },
  weeklyWorkoutTarget: {
    type: Number,
    min: 0,
    default: 3
  },
  preferredWorkoutTime: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
    default: 'Evening'
  },
  dietaryPreferences: [{
    type: String
  }]
}, { timestamps: true });

// Create index to ensure faster retrieval for a member
FitnessGoalSchema.index({ memberId: 1 });

// Delete the model first if it exists to prevent OverwriteModelError
// This is useful in development with hot reloading
const FitnessGoal = mongoose.models.FitnessGoal || mongoose.model<IFitnessGoal>('FitnessGoal', FitnessGoalSchema);

export default FitnessGoal;
