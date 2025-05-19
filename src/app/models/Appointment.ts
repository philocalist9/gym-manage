import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  memberId: mongoose.Types.ObjectId | string;
  trainerId: mongoose.Types.ObjectId | string;
  gymId: mongoose.Types.ObjectId | string;
  date: Date;
  startTime: string; // Format: "HH:MM" (24-hour)
  endTime: string; // Format: "HH:MM" (24-hour)
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  type: 'personal-training' | 'assessment' | 'consultation';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
    index: true
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
    index: true
  },
  gymId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
      message: "Start time must be in HH:MM format (24-hour)"
    }
  },
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
      message: "End time must be in HH:MM format (24-hour)"
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['personal-training', 'assessment', 'consultation'],
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Create indices for faster queries
AppointmentSchema.index({ memberId: 1, date: 1 });
AppointmentSchema.index({ trainerId: 1, date: 1 });
AppointmentSchema.index({ gymId: 1, date: 1 });
AppointmentSchema.index({ status: 1 });

const Appointment = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment;
