"use client";

import React, { useState, useMemo } from 'react';
import { Calendar, Clock, User, X as XIcon, ChevronRight, CheckCircle } from 'lucide-react';
import { formatDate, formatTime } from '@/app/utils/date-utils';

interface Appointment {
  id: string;
  date: string;
  time: string;
  duration: string;
  trainerName: string;
  type: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export default function Appointments() {
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      date: '2025-05-16',
      time: '15:00',
      duration: '60 min',
      trainerName: 'Mike Johnson',
      type: 'Personal Training',
      status: 'upcoming'
    },
    {
      id: '2',
      date: '2025-05-18',
      time: '10:30',
      duration: '45 min',
      trainerName: 'Sarah Wilson',
      type: 'HIIT Session',
      status: 'upcoming'
    },
    {
      id: '3',
      date: '2025-05-14',
      time: '14:00',
      duration: '60 min',
      trainerName: 'Mike Johnson',
      type: 'Strength Training',
      status: 'completed'
    }
  ]);

  const [showBooking, setShowBooking] = useState(false);
  const [sessionType, setSessionType] = useState('personal');
  const [selectedTrainer, setSelectedTrainer] = useState('mike');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Get the next upcoming appointment
  const nextAppointment = useMemo(() => {
    const now = new Date();
    return appointments
      .filter(app => app.status === 'upcoming')
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA.getTime() - dateB.getTime();
      })
      .find(app => {
        const appointmentDate = new Date(`${app.date} ${app.time}`);
        return appointmentDate > now;
      });
  }, [appointments]);

  // Filter appointments by status
  const upcomingAppointments = useMemo(() => 
    appointments.filter(app => app.status === 'upcoming')
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA.getTime() - dateB.getTime();
      }), 
    [appointments]
  );

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to save the appointment
    setShowBooking(false);
  };

  // Get today's date in YYYY-MM-DD format for the date input min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Next Appointment Card */}
      {nextAppointment && (
        <div className="p-6 bg-[#151C2C] rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Next Session</h2>
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white">
                  {nextAppointment.trainerName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-white font-medium">{nextAppointment.type}</h3>
                  <p className="text-sm text-blue-100">with {nextAppointment.trainerName}</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(nextAppointment.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{nextAppointment.time} ({nextAppointment.duration})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Appointments List */}
      <div className="p-6 bg-[#151C2C] rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Upcoming Sessions</h2>
          <button 
            onClick={() => setShowBooking(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book Session
          </button>
        </div>

        <div className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No upcoming sessions. Book one now!
            </div>
          ) : (
            upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-[#1A2234] p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      {appointment.trainerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{appointment.type}</h3>
                      <p className="text-sm text-gray-400">with {appointment.trainerName}</p>
                    </div>
                  </div>
                  {appointment.status === 'completed' && (
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">Completed</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.time} ({appointment.duration})</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                    Reschedule
                  </button>
                  <button className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#151C2C] rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Book a Session</h2>
              <button
                onClick={() => setShowBooking(false)}
                className="text-gray-400 hover:text-white"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Session Type</label>
                <select 
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="personal">Personal Training</option>
                  <option value="hiit">HIIT Session</option>
                  <option value="strength">Strength Training</option>
                  <option value="yoga">Yoga</option>
                  <option value="cardio">Cardio Training</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Trainer</label>
                <select 
                  value={selectedTrainer}
                  onChange={(e) => setSelectedTrainer(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="mike">Mike Johnson - Personal Training, Strength</option>
                  <option value="sarah">Sarah Wilson - HIIT, Cardio</option>
                  <option value="lisa">Lisa Chen - Yoga, Cardio</option>
                  <option value="john">John Smith - Strength, Personal Training</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={today}
                  className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Time</label>
                <select 
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select a time</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                </select>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowBooking(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedDate || !selectedTime}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Book Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
