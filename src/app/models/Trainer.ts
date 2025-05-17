import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ITrainer extends Document {
  name: string;
  email: string;
  password: string;
  specialization: string;
  phone?: string;
  bio: string;
  experience: number; // Years of experience
  totalClients: number;
  rating: number;
  joinDate: Date;
  gymId: mongoose.Types.ObjectId | string; // Reference to the gym this trainer belongs to
  role: string; // Will be 'trainer'
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const TrainerSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] 
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'] 
  },
  specialization: { 
    type: String, 
    required: [true, 'Specialization is required'] 
  },
  phone: { 
    type: String 
  },
  bio: {
    type: String,
    required: [true, 'Bio is required']
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: 0
  },
  totalClients: { 
    type: Number, 
    default: 0 
  },
  rating: { 
    type: Number, 
    default: 5.0,
    min: 0,
    max: 5 
  },
  joinDate: { 
    type: Date, 
    default: Date.now 
  },
  gymId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Gym',
    required: true 
  },
  role: { 
    type: String, 
    default: 'trainer' 
  }
}, { 
  timestamps: true 
});

// Hash password before saving
TrainerSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    // Ensure password is treated as a string when passing to bcrypt
    this.password = await bcrypt.hash(this.password as string, 10);
  }
  next();
});

// Method to compare passwords
TrainerSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Trainer || mongoose.model<ITrainer>('Trainer', TrainerSchema);
