import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthCheckIn extends Document {
  memberId: mongoose.Types.ObjectId;
  date: Date;
  weight?: number;
  sleepHours?: number;
  stressLevel?: 'Low' | 'Medium' | 'High';
  mood?: 'Excellent' | 'Good' | 'Neutral' | 'Poor' | 'Terrible';
  energyLevel?: 'High' | 'Medium' | 'Low';
  waterIntake?: number; // in liters
  nutritionQuality?: 'Excellent' | 'Good' | 'Average' | 'Poor' | 'Terrible';
  soreness?: {
    level: 'None' | 'Mild' | 'Moderate' | 'Severe';
    areas?: string[];
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HealthCheckInSchema = new Schema<IHealthCheckIn>(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    weight: {
      type: Number,
    },
    sleepHours: {
      type: Number,
      min: 0,
      max: 24,
    },
    stressLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
    },
    mood: {
      type: String,
      enum: ['Excellent', 'Good', 'Neutral', 'Poor', 'Terrible'],
    },
    energyLevel: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
    },
    waterIntake: {
      type: Number,
      min: 0,
    },
    nutritionQuality: {
      type: String,
      enum: ['Excellent', 'Good', 'Average', 'Poor', 'Terrible'],
    },
    soreness: {
      level: {
        type: String,
        enum: ['None', 'Mild', 'Moderate', 'Severe'],
      },
      areas: [String],
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// Create a compound index on memberId and date to ensure a member can only have one check-in per day
HealthCheckInSchema.index({ memberId: 1, date: 1 }, { unique: true });

export default mongoose.models.HealthCheckIn || 
  mongoose.model<IHealthCheckIn>('HealthCheckIn', HealthCheckInSchema);
