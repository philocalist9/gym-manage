"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

// Define interfaces based on our models
interface AppointmentData {
  memberId: string;
  gymId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'personal-training' | 'assessment' | 'consultation';
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

interface AddSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (appointmentData: AppointmentData) => Promise<void>;
  selectedDate: Date;
}

const timeSlots = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00"
];

const sessionTypes = [
  { label: "Personal Training", value: "personal-training" },
  { label: "Assessment", value: "assessment" },
  { label: "Consultation", value: "consultation" }
];

const durations = [
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 }
];

export default function AddSessionModal({ isOpen, onClose, onAdd, selectedDate }: AddSessionModalProps) {
  const [formData, setFormData] = useState({
    memberId: "",
    startTime: timeSlots[0],
    duration: 60,
    type: "personal-training",
    notes: ""
  });
  
  // Define proper types for members and gyms
  interface Member {
    _id: string;
    name: string;
    email: string;
    membershipType: string;
    memberNumber: string;
  }

  interface Gym {
    _id: string;
    gymName: string;
    address: string;
  }

  const [members, setMembers] = useState<Member[]>([]);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Format date to YYYY-MM-DD for API
  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Calculate end time based on start time and duration
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    
    const endHours = String(endDate.getHours()).padStart(2, '0');
    const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
    
    return `${endHours}:${endMinutes}`;
  };
  
  // Fetch members and gyms when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchMembers();
      fetchGyms();
    }
  }, [isOpen]);
  
  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/members');
      
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      
      const data = await response.json();
      console.log('Fetched members:', data.members);
      
      if (!data.members || data.members.length === 0) {
        console.warn('No members returned from API');
        setError('No clients available. Please contact your administrator.');
      } else if (!data.members[0].name) {
        console.warn('Member data missing name field:', data.members[0]);
        setError('Client data format issue. Please contact your administrator.');
      }
      
      setMembers(data.members || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Error loading members: ' + errorMessage);
      console.error('Error fetching members:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchGyms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/gym?all=true');
      
      if (!response.ok) {
        throw new Error('Failed to fetch gyms');
      }
      
      const data = await response.json();
      setGyms(data.gyms || []);
      
      // No need to set default gym anymore since we always use the trainer's gym
      // We'll directly use the gym data in the form
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Error loading gyms: ' + errorMessage);
      console.error('Error fetching gyms:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gyms.length) {
      setError('No gym available. Please try again later.');
      return;
    }
    
    // Calculate end time
    const endTime = calculateEndTime(formData.startTime, formData.duration);
    
    // Format date for API
    const date = formatDateForAPI(selectedDate);
    
    try {
      await onAdd({
        memberId: formData.memberId,
        gymId: gyms[0]._id, // Always use the trainer's gym
        date,
        startTime: formData.startTime,
        endTime,
        type: formData.type as 'personal-training' | 'assessment' | 'consultation',
        notes: formData.notes,
        status: 'confirmed' // Trainer-created appointments are automatically confirmed
      });
      
      // Reset form
      setFormData({
        memberId: "",
        startTime: timeSlots[0],
        duration: 60,
        type: "personal-training",
        notes: ""
      });
      
      onClose();
    } catch (err) {
      console.error("Error creating appointment:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#151C2C] rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Appointment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Client
              </label>
              {isLoading ? (
                <div className="w-full p-2 bg-[#1A2234] rounded-lg text-gray-400">Loading...</div>
              ) : (
                <select
                  value={formData.memberId}
                  onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select a client</option>
                  {members.length > 0 ? (
                    members.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name || (member.email ? member.email.split('@')[0] : `Client ${member._id.toString().slice(-4)}`)}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No clients available</option>
                  )}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Location
              </label>
              {isLoading ? (
                <div className="w-full p-2 bg-[#1A2234] rounded-lg text-gray-400">Loading...</div>
              ) : (
                <div className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200">
                  {gyms.length > 0 ? gyms[0].gymName : 'Loading gym...'}
                  <input
                    type="hidden"
                    value={gyms.length > 0 ? gyms[0]._id : ''}
                    name="gymId"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Start Time
                </label>
                <select
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  {durations.map((duration) => (
                    <option key={duration.value} value={duration.value}>{duration.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Appointment Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
              >
                {sessionTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Schedule Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
