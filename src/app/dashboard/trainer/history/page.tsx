"use client";

import React, { useState, useMemo } from "react";
import { Calendar, Search, Filter, ChevronDown, Clock, Check, X as XIcon } from "lucide-react";
import { formatDate } from "@/app/utils/date-utils";

interface SessionHistory {
  id: string;
  clientName: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  status: "Completed" | "Cancelled" | "No Show";
  notes?: string;
  rating?: number;
}

export default function SessionHistoryPage() {
  const [sessions] = useState<SessionHistory[]>([
    {
      id: "1",
      clientName: "John Doe",
      date: "2025-05-14",
      time: "09:00",
      duration: "60 min",
      type: "Weight Training",
      status: "Completed",
      notes: "Great progress on squat form",
      rating: 5
    },
    {
      id: "2",
      clientName: "Sarah Smith",
      date: "2025-05-14",
      time: "10:30",
      duration: "45 min",
      type: "HIIT",
      status: "Completed",
      rating: 4
    },
    {
      id: "3",
      clientName: "Mike Johnson",
      date: "2025-05-13",
      time: "14:00",
      duration: "60 min",
      type: "Strength Training",
      status: "Cancelled",
      notes: "Client emergency"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Filter sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch = 
        session.clientName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === "all" || session.status === statusFilter;

      const matchesType =
        typeFilter === "all" || session.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [sessions, searchQuery, statusFilter, typeFilter]);

  const formatSessionDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-8 bg-[#0B101B] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Session History</h1>
        <p className="text-gray-400">View and manage your past training sessions</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
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
            onClick={() => setStatusFilter(statusFilter === "all" ? "Completed" : "all")}
            className="flex items-center gap-2 px-4 py-2 bg-[#151C2C] text-gray-200 rounded-lg hover:bg-[#1A2234] transition-colors border border-gray-800"
          >
            <Filter className="w-5 h-5" />
            <span>Status: {statusFilter === "all" ? "All" : statusFilter}</span>
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
                onClick={() => setStatusFilter("Completed")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                Completed
              </button>
              <button
                onClick={() => setStatusFilter("Cancelled")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                Cancelled
              </button>
              <button
                onClick={() => setStatusFilter("No Show")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                No Show
              </button>
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div className="relative">
          <button 
            onClick={() => setTypeFilter(typeFilter === "all" ? "Weight Training" : "all")}
            className="flex items-center gap-2 px-4 py-2 bg-[#151C2C] text-gray-200 rounded-lg hover:bg-[#1A2234] transition-colors border border-gray-800"
          >
            <span>Type: {typeFilter === "all" ? "All" : typeFilter}</span>
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
                onClick={() => setTypeFilter("Weight Training")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                Weight Training
              </button>
              <button
                onClick={() => setTypeFilter("HIIT")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                HIIT
              </button>
              <button
                onClick={() => setTypeFilter("Strength Training")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                Strength Training
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <div key={session.id} className="bg-[#151C2C] rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {session.clientName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{session.clientName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatSessionDate(session.date)}</span>
                      <span>•</span>
                      <Clock className="w-4 h-4" />
                      <span>{session.time}</span>
                      <span>•</span>
                      <span>{session.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mb-4">
                  <span className={`px-2 py-1 rounded-lg text-sm font-medium
                    ${session.status === "Completed"
                      ? "bg-green-500/10 text-green-500"
                      : session.status === "Cancelled"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-red-500/10 text-red-500"
                    }`}>
                    {session.status}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-sm font-medium
                    ${session.type === "Weight Training"
                      ? "bg-blue-500/10 text-blue-500"
                      : session.type === "HIIT"
                      ? "bg-purple-500/10 text-purple-500"
                      : "bg-green-500/10 text-green-500"
                    }`}>
                    {session.type}
                  </span>
                </div>

                {session.notes && (
                  <p className="text-sm text-gray-400 mb-4">{session.notes}</p>
                )}

                {session.rating && (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`w-4 h-4 ${
                          index < session.rating!
                            ? "text-yellow-500"
                            : "text-gray-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center">
                {session.status === "Completed" ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : session.status === "Cancelled" ? (
                  <XIcon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <XIcon className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
