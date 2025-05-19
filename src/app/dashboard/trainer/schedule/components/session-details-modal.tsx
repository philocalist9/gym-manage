"use client";

import React from "react";
import { X, Clock, Calendar, User, MapPin } from "lucide-react";

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: IAppointment | null;
  onUpdateStatus: (appointmentId: string, status: string) => Promise<void>;
  isUpdating: boolean;
}

interface IAppointment {
  _id: string;
  memberId: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    membershipType?: string;
  };
  trainerId: string;
  gymId: {
    _id: string;
    name: string;
    location?: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  type: 'personal-training' | 'assessment' | 'consultation';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export default function SessionDetailsModal({ 
  isOpen, 
  onClose, 
  appointment,
  onUpdateStatus,
  isUpdating
}: SessionDetailsModalProps) {
  if (!isOpen || !appointment) return null;

  // Format time from 24h to 12h format
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${hour12}:${minutes} ${period}`;
  };

  // Format date to display
  const formatAppointmentDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format appointment type for display
  const formatType = (type: string): string => {
    return type
      .replace('-', ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get status display name
  const getStatusDisplayName = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-500/10 text-blue-500";
      case "completed":
        return "bg-green-500/10 text-green-500";
      case "cancelled":
        return "bg-red-500/10 text-red-500";
      case "pending":
      default:
        return "bg-yellow-500/10 text-yellow-500";
    }
  };

  // Client name or placeholder
  const clientName = appointment.memberId && typeof appointment.memberId === 'object' 
    ? appointment.memberId.name 
    : 'Client';

  // Gym location
  const gymName = appointment.gymId && typeof appointment.gymId === 'object'
    ? appointment.gymId.name
    : 'Gym';

  const clientEmail = appointment.memberId && typeof appointment.memberId === 'object'
    ? appointment.memberId.email 
    : '';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#151C2C] rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Appointment Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(appointment.status)}`}>
              {getStatusDisplayName(appointment.status)}
            </span>
          </div>

          {/* Client Information */}
          <div className="bg-[#1A2234] p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <User className="w-5 h-5 text-blue-500 mr-2" />
              <p className="text-sm text-gray-400">Client Information</p>
            </div>
            <p className="text-gray-200 font-medium">{clientName}</p>
            {clientEmail && (
              <p className="text-gray-400 text-sm">{clientEmail}</p>
            )}
          </div>

          {/* Appointment Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                <p className="text-sm text-gray-400">Date</p>
              </div>
              <p className="text-gray-200">{formatAppointmentDate(appointment.date)}</p>
            </div>

            <div className="bg-[#1A2234] p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="w-4 h-4 text-blue-500 mr-2" />
                <p className="text-sm text-gray-400">Time</p>
              </div>
              <p className="text-gray-200">{`${formatTime(appointment.startTime)} - ${formatTime(appointment.endTime)}`}</p>
            </div>

            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Session Type</p>
              <span className="px-2 py-1 rounded-lg text-sm font-medium bg-blue-500/10 text-blue-500">
                {formatType(appointment.type)}
              </span>
            </div>

            <div className="bg-[#1A2234] p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <MapPin className="w-4 h-4 text-blue-500 mr-2" />
                <p className="text-sm text-gray-400">Location</p>
              </div>
              <p className="text-gray-200">{gymName}</p>
            </div>
          </div>

          {/* Notes Section */}
          {appointment.notes && (
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Session Notes</p>
              <p className="text-gray-200">{appointment.notes}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            disabled={isUpdating}
          >
            Close
          </button>
          
          <div className="flex gap-2">
            {appointment.status === 'pending' && (
              <>
                <button
                  onClick={() => onUpdateStatus(appointment._id, 'confirmed')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Confirming...' : 'Confirm'}
                </button>
                <button
                  onClick={() => onUpdateStatus(appointment._id, 'cancelled')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Cancelling...' : 'Cancel'}
                </button>
              </>
            )}
            
            {appointment.status === 'confirmed' && (
              <button
                onClick={() => onUpdateStatus(appointment._id, 'completed')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={isUpdating}
              >
                {isUpdating ? 'Completing...' : 'Mark Complete'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
