"use client";

import React from 'react';
import { Calendar, Clock, User, X as XIcon, CheckCircle2, AlertCircle, MessagesSquare } from 'lucide-react';
import { formatMonthNameDate } from '@/app/utils/date-formatting';

interface IAppointment {
  _id: string;
  memberId: string;
  trainerId: string | {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    specialities?: string[];
  };
  gymId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  type: 'personal-training' | 'assessment' | 'consultation';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: IAppointment | null;
  onCancelAppointment: (appointmentId: string) => void;
  isCancelling: boolean;
}

export default function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
  onCancelAppointment,
  isCancelling
}: AppointmentDetailsModalProps) {
  if (!isOpen || !appointment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-blue-500';
      case 'pending':
        return 'text-yellow-500';
      case 'cancelled':
        return 'text-red-500';
      case 'completed':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${hour12}:${minutes} ${period}`;
  };

  const getSessionDuration = (start: string, end: string): string => {
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);
    
    const startMinutesTotal = startHours * 60 + startMinutes;
    const endMinutesTotal = endHours * 60 + endMinutes;
    
    const durationMinutes = endMinutesTotal - startMinutesTotal;
    
    if (durationMinutes < 60) {
      return `${durationMinutes} min`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
    }
  };

  const trainerName = typeof appointment.trainerId === 'object' ? appointment.trainerId.name : 'Trainer';
  const trainerSpecialities = typeof appointment.trainerId === 'object' && appointment.trainerId.specialities
    ? appointment.trainerId.specialities.join(', ')
    : 'Personal Training';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#151C2C] rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Appointment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-medium">
                {trainerName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-white font-medium text-lg capitalize">{appointment.type.replace('-', ' ')}</h3>
                <p className="text-gray-400">with {trainerName}</p>
                <p className="text-sm text-gray-500">{trainerSpecialities}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(appointment.status)}
              <span className={`capitalize ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Date</span>
              </div>
              <p className="text-white">{formatMonthNameDate(appointment.date)}</p>
            </div>

            <div className="bg-[#1A2234] p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Time</span>
              </div>
              <p className="text-white">{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</p>
              <p className="text-xs text-gray-500">{getSessionDuration(appointment.startTime, appointment.endTime)}</p>
            </div>
          </div>

          {appointment.notes && (
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <MessagesSquare className="w-4 h-4" />
                <span className="text-sm">Notes</span>
              </div>
              <p className="text-white text-sm">{appointment.notes}</p>
            </div>
          )}

          {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => onCancelAppointment(appointment._id)}
                disabled={isCancelling}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCancelling && (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
