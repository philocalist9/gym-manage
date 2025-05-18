import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IMember extends Document {
  name: string;
  email: string;
  password: string;
  memberNumber: string; // Unique 6-digit member number
  membershipType: 'Basic' | 'Premium' | 'VIP';
  status: 'Active' | 'Inactive' | 'Pending';
  joiningDate: Date;
  nextPayment: Date;
  trainer?: mongoose.Types.ObjectId | string; // Reference to trainer (optional)
  attendance: number;
  gymId: mongoose.Types.ObjectId | string; // Reference to the gym this member belongs to
  role: string; // Will be 'member'
  feeAmount: number; // Fee amount in Indian Rupees
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const MemberSchema: Schema = new Schema({
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
  memberNumber: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 6
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'] 
  },
  membershipType: { 
    type: String, 
    enum: ['Basic', 'Premium', 'VIP'],
    required: [true, 'Membership type is required'] 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Active'
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  nextPayment: {
    type: Date,
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer'
  },
  attendance: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  gymId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym',
    required: true
  },
  role: {
    type: String,
    default: 'member'
  },
  feeAmount: {
    type: Number,
    default: 1000,  // Default fee of 1000 Indian Rupees
    min: 0
  }
}, { timestamps: true });

// Generate a unique 6-digit member number
MemberSchema.pre('validate', async function(this: IMember, next) {
  try {
    // Only generate member number if it's a new document
    if (this.isNew && !this.memberNumber) {
      // Generate a random 6-digit number
      const generateMemberNumber = (): string => {
        // Generate a number between 100000 and 999999
        return Math.floor(100000 + Math.random() * 900000).toString();
      };

      // Check if the generated number already exists
      let memberNumber = generateMemberNumber();
      let existingMember = await mongoose.models.Member?.findOne({ memberNumber });
      
      // Keep generating until we find a unique one
      while (existingMember) {
        memberNumber = generateMemberNumber();
        existingMember = await mongoose.models.Member?.findOne({ memberNumber });
      }
      
      this.memberNumber = memberNumber;
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Hash password before saving
MemberSchema.pre('save', async function(this: IMember, next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
MemberSchema.methods.comparePassword = async function(candidatePassword: string) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Delete the model first if it exists to prevent OverwriteModelError
// This is useful in development with hot reloading
const Member = mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);

export default Member;
