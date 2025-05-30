"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Plus, X, Check } from "lucide-react";
import { formatDate } from "@/app/utils/date-utils";
import AddSessionModal from "./components/add-session-modal";
import SessionDetailsModal from "./components/session-details-modal";

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

const timeSlots = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00"
];

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate days in the current week
  const daysInWeek = [...Array(7)].map((_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - date.getDay() + i);
    return date;
  });

  // Format date to YYYY-MM-DD for API queries
  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Fetch appointments for the current week when it changes
  useEffect(() => {
    fetchAppointmentsForWeek();
  }, [currentDate]);

  const fetchAppointmentsForWeek = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get start and end dates for the current week view
      const startDate = formatDateForAPI(daysInWeek[0]);
      const endDate = formatDateForAPI(daysInWeek[6]);
      
      // Fetch appointments within the date range
      const response = await fetch(`/api/trainers/appointments?startDate=${startDate}&endDate=${endDate}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Error loading appointments: ' + errorMessage);
      console.error('Error fetching appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      setIsUpdating(true);
      
      const response = await fetch(`/api/trainers/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update appointment');
      }
      
      // Refresh appointments
      fetchAppointmentsForWeek();
      
      // Close modal if we were viewing this appointment
      if (selectedAppointment && selectedAppointment._id === appointmentId) {
        setSelectedAppointment(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Error updating appointment: ' + errorMessage);
      console.error('Error updating appointment:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const formatScheduleDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Get appointments for a specific day and time slot
  const getAppointmentsForSlot = (date: Date, timeSlot: string) => {
    const formattedDate = formatDateForAPI(date);
    
    return appointments.filter(appointment => {
      // Match date
      const appointmentDate = appointment.date.split('T')[0];
      if (appointmentDate !== formattedDate) return false;
      
      // Match time slot - we consider an appointment to be in a slot if it starts within that hour
      const appointmentHour = parseInt(appointment.startTime.split(':')[0]);
      const slotHour = parseInt(timeSlot.split(':')[0]);
      
      return appointmentHour === slotHour;
    });
  };

  // Handle adding a new appointment from the AddSessionModal
  // Define the appointment interface
  interface NewAppointment {
    memberId: string;
    gymId: string;
    date: string;
    startTime: string;
    endTime: string;
    type: 'personal-training' | 'assessment' | 'consultation';
    notes: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  }

  const handleAddAppointment = async (newAppointment: NewAppointment) => {
    try {
      setIsUpdating(true);
      
      const response = await fetch('/api/trainers/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAppointment),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create appointment');
      }
      
      // Refresh appointments
      fetchAppointmentsForWeek();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Error creating appointment: ' + errorMessage);
      console.error('Error creating appointment:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatWeekRange = () => {
    return `${formatDate(daysInWeek[0], { month: 'short', day: 'numeric' })} - ${formatDate(daysInWeek[6], { month: 'short', day: 'numeric' })}`;
  };

  // Get appropriate CSS class for the appointment status
  const getAppointmentStatusClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-500/10 text-blue-500 border-blue-500";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500";
      case "pending":
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500";
    }
  };

  return (
    <div className="p-8 bg-[#0B101B] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Schedule</h1>
          <p className="text-gray-400">Manage your training sessions and appointments</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Session</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 mb-6">
          {error}
        </div>
      )}

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6 bg-[#151C2C] p-4 rounded-lg">
        <button
          onClick={handlePreviousWeek}
          className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-white font-medium">
          {formatWeekRange()}
        </div>

        <button
          onClick={handleNextWeek}
          className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#151C2C] rounded-xl overflow-hidden">
        <div className="grid grid-cols-8 border-b border-gray-800">
          <div className="p-4">
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          {daysInWeek.map((date, index) => (
            <div
              key={index}
              className={`p-4 text-center ${
                isToday(date) ? 'bg-blue-600/10' : ''
              }`}
            >
              <p className="text-gray-400 text-sm">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <p className={`text-lg font-medium ${
                isToday(date) ? 'text-blue-500' : 'text-white'
              }`}>
                {date.getDate()}
              </p>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-8">
                <div className="p-4 border-r border-gray-800">
                  <span className="text-sm text-gray-400">{time}</span>
                </div>
                {daysInWeek.map((date, index) => {
                  const appointmentsInSlot = getAppointmentsForSlot(date, time);
                  
                  return (
                    <div
                      key={index}
                      className={`p-2 border-r border-gray-800 min-h-[80px] ${
                        isToday(date) ? 'bg-blue-600/5' : ''
                      }`}
                      onClick={() => {
                        // If we wanted to add appointment for this slot
                        const newDate = new Date(date);
                        setSelectedDate(newDate);
                      }}
                    >
                      {appointmentsInSlot.length > 0 && appointmentsInSlot.map(appointment => {
                        // Get client name
                        const clientName = appointment.memberId && typeof appointment.memberId === 'object' 
                          ? appointment.memberId.name 
                          : 'Client';
                        
                        // Format type for display
                        const formattedType = appointment.type
                          .replace('-', ' ')
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');
                        
                        return (
                          <div
                            key={appointment._id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppointment(appointment);
                            }}
                            className={`p-2 rounded-lg cursor-pointer mb-2 border-l-2 ${getAppointmentStatusClass(appointment.status)}`}
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{clientName}</p>
                              {appointment.status === 'pending' && (
                                <div className="flex space-x-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateAppointmentStatus(appointment._id, 'confirmed');
                                    }}
                                    className="text-blue-500 hover:text-blue-400"
                                    title="Confirm appointment"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateAppointmentStatus(appointment._id, 'cancelled');
                                    }}
                                    className="text-red-500 hover:text-red-400"
                                    title="Cancel appointment"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                            <p className="text-xs opacity-75">{formattedType}</p>
                            <p className="text-xs">{`${appointment.startTime} - ${appointment.endTime}`}</p>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddSessionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddAppointment}
        selectedDate={selectedDate}
      />
      <SessionDetailsModal 
        isOpen={selectedAppointment !== null}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
        onUpdateStatus={updateAppointmentStatus}
        isUpdating={isUpdating}
      />
    </div>
  );
}
