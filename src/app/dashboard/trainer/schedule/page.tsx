"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import { formatDate } from "@/app/utils/date-utils";
import AddSessionModal from "./components/add-session-modal";
import SessionDetailsModal from "./components/session-details-modal";

interface Session {
  id: string;
  clientName: string;
  time: string;
  duration: string;
  type: string;
  notes?: string;
}

const timeSlots = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00"
];

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date("2025-05-15"));
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      clientName: "John Doe",
      time: "2025-05-15T09:00",
      duration: "1 hour",
      type: "Weight Training",
      notes: "Focus on upper body"
    },
    {
      id: "2",
      clientName: "Sarah Smith",
      time: "2025-05-15T11:00",
      duration: "45 min",
      type: "HIIT",
      notes: "Cardio intensive session"
    },
    {
      id: "3",
      clientName: "Mike Johnson",
      time: "2025-05-15T14:00",
      duration: "1 hour",
      type: "Strength Training",
      notes: "Lower body day"
    }
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);

  const daysInWeek = [...Array(7)].map((_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - date.getDay() + i);
    return date;
  });

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

  const formatDateToISOString = (date: Date, time: string) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${time}`;
  };

  const isToday = (date: Date) => {
    const today = new Date("2025-05-15");
    return date.toDateString() === today.toDateString();
  };

  const getSessionForSlot = (date: Date, time: string) => {
    const dateString = formatDateToISOString(date, time);
    return sessions.find(session => session.time === dateString);
  };

  const handleAddSession = (newSession: Omit<Session, "id">) => {
    const id = (sessions.length + 1).toString();
    setSessions([...sessions, { ...newSession, id }]);
  };

  const formatWeekRange = () => {
    return `${formatDate(daysInWeek[0], { month: 'short', day: 'numeric' })} - ${formatDate(daysInWeek[6], { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="p-8 bg-[#0B101B] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Schedule</h1>
          <p className="text-gray-400">Manage your training sessions</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Session</span>
        </button>
      </div>

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

        <div className="divide-y divide-gray-800">
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8">
              <div className="p-4 border-r border-gray-800">
                <span className="text-sm text-gray-400">{time}</span>
              </div>
              {daysInWeek.map((date, index) => {
                const session = getSessionForSlot(date, time);
                return (
                  <div
                    key={index}
                    className={`p-2 border-r border-gray-800 min-h-[80px] ${
                      isToday(date) ? 'bg-blue-600/5' : ''
                    }`}
                  >
                    {session && (
                      <div
                        onClick={() => setSelectedSession(session)}
                        className={`p-2 rounded-lg cursor-pointer
                          ${session.type === "Weight Training"
                            ? "bg-blue-500/10 text-blue-500"
                            : session.type === "HIIT"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-purple-500/10 text-purple-500"
                          }`}
                      >
                        <p className="font-medium text-sm">{session.clientName}</p>
                        <p className="text-xs opacity-75">{session.type}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AddSessionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSession}
        selectedDate={selectedDate}
      />
      <SessionDetailsModal 
        isOpen={selectedSession !== null}
        onClose={() => setSelectedSession(null)}
        session={selectedSession}
      />
    </div>
  );
}
