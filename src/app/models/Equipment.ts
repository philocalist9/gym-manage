import mongoose, { Schema, Document } from 'mongoose';

export interface IEquipment extends Document {
  name: string;
  category: string;
  serialNumber?: string;
  purchaseDate: Date;
  condition: string;
  cost: number;
  quantity: number; // Number of equipment
  weight?: number; // Equipment weight in kg
  gymId: mongoose.Types.ObjectId | string; // Reference to the gym this equipment belongs to
  isInUse: boolean;
}

const EquipmentSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Equipment name is required'] 
  },
  category: { 
    type: String, 
    required: [true, 'Category is required']
  },
  serialNumber: { 
    type: String 
  },
  purchaseDate: { 
    type: Date, 
    default: Date.now 
  },
  condition: { 
    type: String, 
    required: [true, 'Condition is required'],
    enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Needs Repair'],
    default: 'Good'
  },
  cost: { 
    type: Number,
    required: [true, 'Cost is required'],
    min: 0
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 1,
    default: 1
  },
  weight: {
    type: Number,
    min: 0
  },
  gymId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Gym',
    required: [true, 'Gym ID is required']
  },
  isInUse: { 
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

export default mongoose.models.Equipment || mongoose.model<IEquipment>('Equipment', EquipmentSchema);
