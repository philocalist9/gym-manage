"use client";

import React, { useState, useEffect } from 'react';
import { X as XIcon } from 'lucide-react';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointmentData: {
    trainerId: string;
    date: string;
    startTime: string;
    endTime: string;
    type: 'personal-training' | 'assessment' | 'consultation';
    notes: string;
  }) => void;
}

interface Trainer {
  _id: string;
  name: string;
  specialities: string[];
  profilePicture?: string;
  availability?: {
    [key: string]: Array<{ start: string; end: string }>;
  };
}

export default function BookAppointmentModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: BookAppointmentModalProps) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    trainerId: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'personal-training' as 'personal-training' | 'assessment' | 'consultation',
    notes: ''
  });

  // Fetch trainers when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTrainers();
      // Reset form when modal opens
      setFormData({
        trainerId: '',
        date: '',
        startTime: '',
        endTime: '',
        type: 'personal-training',
        notes: ''
      });
    }
  }, [isOpen]);
  
  // Fetch trainers from the API
  const fetchTrainers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/members/trainers');
      
      if (!response.ok) {
        throw new Error('Failed to fetch trainers');
      }
      
      const data = await response.json();
      setTrainers(data.trainers || []);
    } catch (err: any) {
      setError('Error loading trainers: ' + (err.message || 'Unknown error'));
      console.error('Error fetching trainers:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Update available time slots based on trainer and date selection
  useEffect(() => {
    if (formData.trainerId && formData.date) {
      generateAvailableTimeSlots();
    } else {
      setAvailableTimeSlots([]);
    }
  }, [formData.trainerId, formData.date]);
  
  const generateAvailableTimeSlots = () => {
    const selectedTrainer = trainers.find(t => t._id === formData.trainerId);
    const selectedDate = new Date(formData.date);
    const dayOfWeek = selectedDate.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];
    
    // Default time slots if trainer has no specific availability
    const defaultSlots = [
      '09:00', '10:00', '11:00', '12:00', 
      '14:00', '15:00', '16:00', '17:00', '18:00'
    ];
    
    // If trainer has availability for this day, use those time slots
    if (selectedTrainer?.availability && selectedTrainer.availability[dayName]) {
      const timeSlots: string[] = [];
      selectedTrainer.availability[dayName].forEach(slot => {
        let startHour = parseInt(slot.start.split(':')[0]);
        const endHour = parseInt(slot.end.split(':')[0]);
        
        // Generate hourly slots
        while (startHour < endHour) {
          const timeSlot = startHour < 10 ? `0${startHour}:00` : `${startHour}:00`;
          timeSlots.push(timeSlot);
          startHour++;
        }
      });
      
      setAvailableTimeSlots(timeSlots);
    } else {
      setAvailableTimeSlots(defaultSlots);
    }
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // If selecting a start time, automatically set end time to one hour later
    if (name === 'startTime' && value) {
      const [hours, minutes] = value.split(':').map(Number);
      let endHour = hours + 1;
      if (endHour > 23) endHour = 23; // Cap at 11 PM
      
      const endTime = `${endHour < 10 ? '0' + endHour : endHour}:${minutes < 10 ? '0' + minutes : minutes}`;
      setFormData(prevData => ({
        ...prevData,
        endTime
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  if (!isOpen) return null;
  
  // Get today's date in YYYY-MM-DD format for the date input min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#151C2C] rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Book a Session</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {loading && (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-400">Loading trainers...</p>
          </div>
        )}

        {error && (
          <div className="p-4 mb-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Session Type</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="personal-training">Personal Training</option>
                <option value="assessment">Fitness Assessment</option>
                <option value="consultation">Consultation</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Trainer</label>
              <select 
                name="trainerId"
                value={formData.trainerId}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select a trainer</option>
                {trainers.map((trainer) => (
                  <option key={trainer._id} value={trainer._id}>
                    {trainer.name} - {trainer.specialities ? trainer.specialities.join(', ') : 'General Training'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Start Time</label>
              <select 
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500"
                disabled={!formData.trainerId || !formData.date}
                required
              >
                <option value="">Select a time</option>
                {availableTimeSlots.map((timeSlot) => (
                  <option key={timeSlot} value={timeSlot}>
                    {formatTimeDisplay(timeSlot)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any specific requests or information for the trainer"
                className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500 h-24 resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.trainerId || !formData.date || !formData.startTime}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Book Session
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Helper function to format time display (24h to 12h)
function formatTimeDisplay(time: string): string {
  const [hours, minutes] = time.split(':');
  const hourNum = parseInt(hours);
  const period = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
  return `${hour12}:${minutes} ${period}`;
}
