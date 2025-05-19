import mongoose, { Schema, Document } from 'mongoose';

export interface IExerciseProgress {
  name: string;
  completed: boolean;
}

export interface IWorkoutProgress extends Document {
  memberId: mongoose.Types.ObjectId | string;
  planId: mongoose.Types.ObjectId | string;
  date: Date;
  day: string;
  exercises: IExerciseProgress[];
  completed: boolean;
  createdAt: Date;
}

const ExerciseProgressSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const WorkoutProgressSchema = new Schema({
  memberId: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
    index: true
  },
  planId: {
    type: Schema.Types.ObjectId,
    ref: 'ClientWorkout',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: true
  },
  exercises: [ExerciseProgressSchema],
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add compound index for memberId and date to improve query performance
WorkoutProgressSchema.index({ memberId: 1, date: 1 });

export default mongoose.models.WorkoutProgress || 
  mongoose.model<IWorkoutProgress>('WorkoutProgress', WorkoutProgressSchema);
