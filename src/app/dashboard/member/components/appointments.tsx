"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, User, Filter, ChevronRight, CheckCircle2, X as XIcon, AlertCircle } from 'lucide-react';
import { formatMonthNameDate } from '@/app/utils/date-formatting';
import BookAppointmentModal from './BookAppointmentModal';
import AppointmentDetailsModal from './AppointmentDetailsModal';

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

export default function Appointments() {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Fetch appointments when component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async (status?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      let url = '/api/members/appointments';
      if (status && status !== 'all') {
        url += `?status=${status}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (err: any) {
      setError('Error loading appointments: ' + (err.message || 'Unknown error'));
      console.error('Error fetching appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    fetchAppointments(status);
  };

  // Book new appointment
  const handleBookAppointment = async (appointmentData: any) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/members/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to book appointment');
      }
      
      // Refresh appointments list
      fetchAppointments(statusFilter !== 'all' ? statusFilter : undefined);
      setShowBookingModal(false);
    } catch (err: any) {
      setError('Error booking appointment: ' + (err.message || 'Unknown error'));
      console.error('Error booking appointment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel appointment
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      setIsCancelling(true);
      
      const response = await fetch(`/api/members/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel appointment');
      }
      
      // Refresh appointments list
      fetchAppointments(statusFilter !== 'all' ? statusFilter : undefined);
      setSelectedAppointment(null);
    } catch (err: any) {
      setError('Error cancelling appointment: ' + (err.message || 'Unknown error'));
      console.error('Error cancelling appointment:', err);
    } finally {
      setIsCancelling(false);
    }
  };

  // Get the next upcoming appointment
  const nextAppointment = useMemo(() => {
    const now = new Date();
    return appointments
      .filter(app => app.status === 'confirmed' || app.status === 'pending')
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
      })
      .find(app => {
        const appointmentDate = new Date(`${app.date}T${app.startTime}`);
        return appointmentDate > now;
      });
  }, [appointments]);

  // Filter and sort appointments
  const filteredAppointments = useMemo(() => 
    appointments
      .filter(app => statusFilter === 'all' || app.status === statusFilter)
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateB.getTime() - dateA.getTime();
      }), 
    [appointments, statusFilter]
  );

  // Format time display (24h to 12h)
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${hour12}:${minutes} ${period}`;
  };

  // Get session duration
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

  // Get status color
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XIcon className="w-5 h-5 text-red-500" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-gray-400">Loading appointments...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Next Appointment Card */}
          {nextAppointment && (
            <div className="p-6 bg-[#151C2C] rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Next Session</h2>
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-lg cursor-pointer"
                onClick={() => setSelectedAppointment(nextAppointment)}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white">
                      {typeof nextAppointment.trainerId === 'object' && nextAppointment.trainerId.name
                        ? nextAppointment.trainerId.name.split(' ').map(n => n[0]).join('')
                        : 'TR'}
                    </div>
                    <div>
                      <h3 className="text-white font-medium capitalize">{nextAppointment.type.replace('-', ' ')}</h3>
                      <p className="text-sm text-blue-100">
                        with {typeof nextAppointment.trainerId === 'object' ? nextAppointment.trainerId.name : 'Trainer'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-blue-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatMonthNameDate(nextAppointment.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(nextAppointment.startTime)} ({getSessionDuration(nextAppointment.startTime, nextAppointment.endTime)})</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Appointments List */}
          <div className="p-6 bg-[#151C2C] rounded-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-white">Appointments</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-sm bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 appearance-none focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Appointments</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Session
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  {statusFilter === 'all' 
                    ? 'No appointments found. Book a session now!' 
                    : `No ${statusFilter} appointments found.`}
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <div 
                    key={appointment._id} 
                    className="bg-[#1A2234] p-4 rounded-lg cursor-pointer hover:bg-[#222c41] transition-colors"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                          {typeof appointment.trainerId === 'object' && appointment.trainerId.name
                            ? appointment.trainerId.name.split(' ').map(n => n[0]).join('')
                            : 'TR'}
                        </div>
                        <div>
                          <h3 className="text-white font-medium capitalize">{appointment.type.replace('-', ' ')}</h3>
                          <p className="text-sm text-gray-400">
                            with {typeof appointment.trainerId === 'object' ? appointment.trainerId.name : 'Trainer'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(appointment.status)}
                        <span className={`text-sm capitalize ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatMonthNameDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <BookAppointmentModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSubmit={handleBookAppointment}
      />
      
      <AppointmentDetailsModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
        onCancelAppointment={handleCancelAppointment}
        isCancelling={isCancelling}
      />
    </div>
  );
}
