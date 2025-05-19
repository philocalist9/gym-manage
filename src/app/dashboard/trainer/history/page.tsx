"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Calendar, Search, Filter, ChevronDown, Clock, Check, X as XIcon, Calendar as CalendarIcon } from "lucide-react";
import { formatMonthNameDate } from "@/app/utils/date-formatting";

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

export default function SessionHistoryPage() {
  const [sessions, setSessions] = useState<IAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedSession, setSelectedSession] = useState<IAppointment | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch appointments when component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/trainers/appointments');
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const data = await response.json();
      setSessions(data.appointments || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Error loading appointment history: ' + errorMessage);
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
      
      // Refresh appointments list
      fetchAppointments();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Error updating appointment: ' + errorMessage);
      console.error('Error updating appointment:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Format time display (24h to 12h)
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${hour12}:${minutes} ${period}`;
  };

  // Format session date
  const formatSessionDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatMonthNameDate(date);
  };
  
  // Calculate session duration from start and end time
  const getSessionDuration = (startTime: string, endTime: string): string => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    if (durationMinutes <= 0) durationMinutes += 24 * 60; // Handle overnight sessions
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (hours === 0) {
      return `${minutes} min`;
    } else if (minutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min`;
    }
  };

  // Get appropriate CSS class for status badge
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

  // Filter sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      // Check if memberId exists and is an object with a name property
      const clientName = session.memberId && typeof session.memberId === 'object' ? session.memberId.name : '';
      
      const matchesSearch = 
        clientName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === "all" || session.status === statusFilter;

      const matchesType =
        typeFilter === "all" || session.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    }).sort((a, b) => {
      // Sort by date/time descending (newest first)
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateB.getTime() - dateA.getTime();
    });
  }, [sessions, searchQuery, statusFilter, typeFilter]);

  return (
    <div className="p-8 bg-[#0B101B] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Session History</h1>
        <p className="text-gray-400">View and manage your training sessions with clients</p>
      </div>
      
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#151C2C] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        {/* Status Filter */}
        <div className="relative">
          <button 
            onClick={() => setStatusFilter(statusFilter === "all" ? "completed" : "all")}
            className="flex items-center gap-2 px-4 py-2 bg-[#151C2C] text-gray-200 rounded-lg hover:bg-[#1A2234] transition-colors border border-gray-800"
          >
            <Filter className="w-5 h-5" />
            <span>Status: {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {statusFilter !== "all" && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-[#151C2C] rounded-lg shadow-xl border border-gray-800 z-10">
              <button
                onClick={() => setStatusFilter("all")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter("confirmed")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                Confirmed
              </button>
              <button
                onClick={() => setStatusFilter("completed")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                Completed
              </button>
              <button
                onClick={() => setStatusFilter("cancelled")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                Cancelled
              </button>
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div className="relative">
          <button 
            onClick={() => setTypeFilter(typeFilter === "all" ? "personal-training" : "all")}
            className="flex items-center gap-2 px-4 py-2 bg-[#151C2C] text-gray-200 rounded-lg hover:bg-[#1A2234] transition-colors border border-gray-800"
          >
            <span>Type: {typeFilter === "all" ? "All" : typeFilter.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {typeFilter !== "all" && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-[#151C2C] rounded-lg shadow-xl border border-gray-800 z-10">
              <button
                onClick={() => setTypeFilter("all")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter("personal-training")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                Personal Training
              </button>
              <button
                onClick={() => setTypeFilter("assessment")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                Assessment
              </button>
              <button
                onClick={() => setTypeFilter("consultation")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                Consultation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sessions List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-[#151C2C] rounded-xl p-8 text-center">
          <p className="text-gray-400 mb-2">No appointments found</p>
          <p className="text-sm text-gray-500">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            // Get client initials for avatar
            const clientName = session.memberId && typeof session.memberId === 'object' ? session.memberId.name : 'Client';
            const clientInitials = clientName.split(" ").map(n => n[0]).join("");
            
            // Format date for display
            const appointmentDate = new Date(session.date);
            const formattedDate = formatMonthNameDate(appointmentDate);
            
            // Format session duration
            const duration = getSessionDuration(session.startTime, session.endTime);
            
            return (
              <div key={session._id} className="bg-[#151C2C] rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                        {clientInitials}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">{clientName}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
                          <Calendar className="w-4 h-4" />
                          <span>{formattedDate}</span>
                          <span>•</span>
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(session.startTime)}</span>
                          <span>•</span>
                          <span>{duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mb-4 flex-wrap">
                      <span className={`px-2 py-1 rounded-lg text-sm font-medium ${getStatusBadgeClass(session.status)}`}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-sm font-medium bg-blue-500/10 text-blue-500`}>
                        {session.type.replace('-', ' ').split(' ').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                      {session.gymId && session.gymId.name && (
                        <span className="px-2 py-1 rounded-lg text-sm font-medium bg-purple-500/10 text-purple-500">
                          {session.gymId.name}
                        </span>
                      )}
                    </div>
                    
                    {session.notes && (
                      <p className="text-sm text-gray-400 mb-4">{session.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {session.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateAppointmentStatus(session._id, 'confirmed')}
                          disabled={isUpdating}
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-md text-blue-500"
                          title="Confirm appointment"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => updateAppointmentStatus(session._id, 'cancelled')}
                          disabled={isUpdating}
                          className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-md text-red-500"
                          title="Cancel appointment"
                        >
                          <XIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {session.status === 'confirmed' && (
                      <button 
                        onClick={() => updateAppointmentStatus(session._id, 'completed')}
                        disabled={isUpdating}
                        className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-md text-green-500"
                        title="Mark as completed"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
