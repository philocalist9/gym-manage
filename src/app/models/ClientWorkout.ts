import mongoose, { Schema, Document } from 'mongoose';

export interface IExercise {
  name: string;
  sets: number;
  reps: number;
  rest: string;
  notes?: string;
}

export interface IDayPlan {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  exercises: IExercise[];
}

export interface IClientWorkout extends Document {
  trainerId: mongoose.Types.ObjectId | string;
  clientId: mongoose.Types.ObjectId | string;
  planName: string;
  startDate: Date;
  endDate: Date;
  days: IDayPlan[];
  notes?: string;
  createdAt: Date;
  lastUpdated: Date;
}

const ExerciseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  sets: {
    type: Number,
    required: true,
    min: 1
  },
  reps: {
    type: Number,
    required: true,
    min: 1
  },
  rest: {
    type: String,
    required: true
  },
  notes: String
});

const DayPlanSchema = new Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: true
  },
  exercises: [ExerciseSchema]
});

const ClientWorkoutSchema: Schema = new Schema({
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
    index: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
    index: true
  },
  planName: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  days: [DayPlanSchema],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.ClientWorkout || mongoose.model<IClientWorkout>('ClientWorkout', ClientWorkoutSchema);
