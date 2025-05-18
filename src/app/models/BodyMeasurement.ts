import mongoose, { Schema, Document } from 'mongoose';

export interface IBodyMeasurement extends Document {
  memberId: mongoose.Types.ObjectId | string;
  date: Date;
  measurements: {
    chest: number;
    waist: number;
    hips: number;
    biceps: number;
    thighs: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BodyMeasurementSchema: Schema = new Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  measurements: {
    chest: {
      type: Number,
      min: 0,
      default: 0
    },
    waist: {
      type: Number,
      min: 0,
      default: 0
    },
    hips: {
      type: Number,
      min: 0,
      default: 0
    },
    biceps: {
      type: Number,
      min: 0,
      default: 0
    },
    thighs: {
      type: Number,
      min: 0,
      default: 0
    }
  }
}, { timestamps: true });

// Create index to ensure faster retrieval for a member with date sorting
BodyMeasurementSchema.index({ memberId: 1, date: -1 });

// Delete the model first if it exists to prevent OverwriteModelError
// This is useful in development with hot reloading
const BodyMeasurement = mongoose.models.BodyMeasurement || 
  mongoose.model<IBodyMeasurement>('BodyMeasurement', BodyMeasurementSchema);

export default BodyMeasurement;
