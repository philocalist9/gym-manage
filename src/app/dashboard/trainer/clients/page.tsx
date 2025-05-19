"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, Filter, MoreVertical, ChevronDown, Users } from "lucide-react";
import { formatDate } from "@/app/utils/date-utils";
import ClientDetailsModal from "./components/client-details-modal";
import AddClientModal from "./components/add-client-modal";

interface ApiClient {
  _id: string;
  name: string;
  email: string;
  membershipType: string;
  status: string;
  joiningDate?: string;
  nextAppointment: {
    date: string;
    startTime: string;
    type: string;
    status: string;
  } | null;
  lastWorkout: {
    date: string;
    type: string;
  } | null;
  fitnessGoals?: {
    type: string;
    target: string;
    deadline: string;
  }[] | {
    primaryGoal: string;
    currentWeight?: number;
    targetWeight?: number;
    weeklyWorkoutTarget?: number;
    preferredWorkoutTime?: string;
    dietaryPreferences?: string[];
  };
  isAssigned?: boolean;
  sessionStats?: {
    completed: number;
    upcoming: number;
    total: number;
  }
}

interface Client {
  id: string;
  name: string;
  email: string;
  plan: "Weight Loss" | "Muscle Gain" | "General Fitness" | "Athletic Performance";
  status: "Active" | "On Hold" | "Completed";
  startDate: string;
  nextSession: string;
  progress: number;
  goals: string[];
  lastWorkout: string;
  sessionsCompleted: number;
  sessionsUpcoming: number;
  isAssigned: boolean;
  originalData?: any; // For storing the original API data
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch real clients data
  useEffect(() => {
    async function fetchClients() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/trainers/clients");
        
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        
        const data = await response.json();
        
        // Transform API data to match our interface
        const formattedClients: Client[] = data.clients.map((client: ApiClient) => {
          // Extract fitness goals if available
          const clientGoals = client.fitnessGoals 
            ? (Array.isArray(client.fitnessGoals) 
                ? client.fitnessGoals.map(goal => goal.type) 
                : client.fitnessGoals.primaryGoal 
                  ? [client.fitnessGoals.primaryGoal] 
                  : ["General Fitness"])
            : ["Improve fitness"];
          
          // Format joining date
          const formattedDate = client.joiningDate 
            ? formatDate(new Date(client.joiningDate)) 
            : formatDate(new Date());
            
          // Format next appointment date if exists
          const nextSessionDate = client.nextAppointment?.date
            ? new Date(client.nextAppointment.date).toString() !== "Invalid Date"
              ? formatDate(new Date(client.nextAppointment.date))
              : "No upcoming sessions"
            : "No upcoming sessions";
            
          // Format last workout date if exists
          const lastWorkoutDate = client.lastWorkout?.date
            ? new Date(client.lastWorkout.date).toString() !== "Invalid Date"
              ? formatDate(new Date(client.lastWorkout.date))
              : "Not available"
            : "Not available";
            
          // Calculate progress based on completed sessions if available
          const completedSessions = client.sessionStats?.completed || 0;
          const upcomingSessions = client.sessionStats?.upcoming || 0;
          const totalSessions = client.sessionStats?.total || completedSessions + upcomingSessions;
          
          // Calculate progress - if there are sessions, base it on completion percentage
          // Otherwise use a reasonable random value
          const progressValue = totalSessions > 0 
            ? Math.round((completedSessions / totalSessions) * 100)
            : Math.floor(Math.random() * 80) + 10; // Fallback to random value
            
          return {
            id: client._id,
            name: client.name,
            email: client.email,
            plan: mapMembershipToPlan(client.membershipType),
            status: mapStatus(client.status),
            startDate: formattedDate,
            nextSession: nextSessionDate,
            progress: progressValue,
            goals: clientGoals,
            lastWorkout: lastWorkoutDate,
            sessionsCompleted: completedSessions,
            sessionsUpcoming: upcomingSessions,
            isAssigned: client.isAssigned || false,
            originalData: client // Store original data for reference
          };
        });
        
        setClients(formattedClients);
        setError(null);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching clients");
        console.error("Error fetching clients:", err);
        
        // Fallback to sample data if API fails
        setClients([
          {
            id: "1",
            name: "John Doe",
            email: "john.d@example.com",
            plan: "Weight Loss",
            status: "Active",
            startDate: "2025-01-15",
            nextSession: "2025-05-20",
            progress: 75,
            goals: ["Lose 10kg", "Improve endurance", "Build core strength"],
            lastWorkout: "2025-05-18",
            sessionsCompleted: 8,
            sessionsUpcoming: 4,
            isAssigned: true
          },
          {
            id: "2",
            name: "Sarah Smith",
            email: "sarah.s@example.com",
            plan: "Muscle Gain",
            status: "Active",
            startDate: "2025-02-01",
            nextSession: "2025-05-17",
            progress: 60,
            goals: ["Gain muscle mass", "Increase strength", "Improve form"],
            lastWorkout: "2025-05-15",
            sessionsCompleted: 6,
            sessionsUpcoming: 2,
            isAssigned: true
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClients();
  }, []);

  // Helper functions for mapping API data to our interface
  function mapMembershipToPlan(membershipType: string): "Weight Loss" | "Muscle Gain" | "General Fitness" | "Athletic Performance" {
    switch(membershipType) {
      case 'Premium':
        return "Muscle Gain";
      case 'VIP':
        return "Athletic Performance";
      case 'Weight Loss':
        return "Weight Loss";
      case 'Basic':
      default:
        return "General Fitness";
    }
  }
  
  function mapStatus(status: string): "Active" | "On Hold" | "Completed" {
    switch(status) {
      case 'Active':
        return "Active";
      case 'Inactive':
        return "Completed";
      case 'Pending':
        return "On Hold";
      default:
        return "Active";
    }
  }

  // States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [assignmentFilter, setAssignmentFilter] = useState<string>("all");
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === "all" || client.status === statusFilter;

      const matchesPlan =
        planFilter === "all" || client.plan === planFilter;
        
      const matchesAssignment =
        assignmentFilter === "all" || 
        (assignmentFilter === "assigned" && client.isAssigned) ||
        (assignmentFilter === "unassigned" && !client.isAssigned);

      return matchesSearch && matchesStatus && matchesPlan && matchesAssignment;
    });
  }, [clients, searchQuery, statusFilter, planFilter, assignmentFilter]);

  // Handlers
  const handleAddClient = (newClient: Omit<Client, "id">) => {
    const id = (clients.length + 1).toString();
    
    // Ensure all required properties are present
    const completeClient: Client = {
      ...newClient,
      id,
      sessionsCompleted: newClient.sessionsCompleted || 0,
      sessionsUpcoming: newClient.sessionsUpcoming || 0,
      isAssigned: newClient.isAssigned || false
    };
    
    setClients([...clients, completeClient]);
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    setActiveActionMenu(null);
  };

  // Display loading indicator while fetching data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Display error message if fetching failed
  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500 rounded-lg text-red-500 m-6">
        <p className="font-semibold">Error loading clients</p>
        <p>{error}</p>
      </div>
    );
  }
  
  // Display message if no clients found
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">No Clients Found</h2>
        <p className="text-gray-400 text-center max-w-md">
          You don't have any clients yet. Clients are added to your list when:
          <br /><br />
          • Members are formally assigned to you as their trainer
          <br />
          • You book appointments with members
        </p>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Client</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#0B101B] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Clients</h1>
          <p className="text-gray-400">Manage your client list and progress</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#151C2C] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-3">
          {/* Status Filter */}
          <div className="relative">
            <button 
              onClick={() => setStatusFilter(statusFilter === "all" ? "Active" : "all")}
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
                  onClick={() => setStatusFilter("Active")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter("On Hold")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  On Hold
                </button>
                <button
                  onClick={() => setStatusFilter("Completed")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Completed
                </button>
              </div>
            )}
          </div>

          {/* Plan Filter */}
          <div className="relative">
            <button 
              onClick={() => setPlanFilter(planFilter === "all" ? "Weight Loss" : "all")}
              className="flex items-center gap-2 px-4 py-2 bg-[#151C2C] text-gray-200 rounded-lg hover:bg-[#1A2234] transition-colors border border-gray-800"
            >
              <span>Plan: {planFilter === "all" ? "All" : planFilter}</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {planFilter !== "all" && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-[#151C2C] rounded-lg shadow-xl border border-gray-800 z-10">
                <button
                  onClick={() => setPlanFilter("all")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  All
                </button>
                <button
                  onClick={() => setPlanFilter("Weight Loss")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Weight Loss
                </button>
                <button
                  onClick={() => setPlanFilter("Muscle Gain")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Muscle Gain
                </button>
                <button
                  onClick={() => setPlanFilter("General Fitness")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  General Fitness
                </button>
                <button
                  onClick={() => setPlanFilter("Athletic Performance")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Athletic Performance
                </button>
              </div>
            )}
          </div>
          
          {/* Assignment Filter */}
          <div className="relative">
            <button 
              onClick={() => setAssignmentFilter(assignmentFilter === "all" ? "assigned" : "all")}
              className="flex items-center gap-2 px-4 py-2 bg-[#151C2C] text-gray-200 rounded-lg hover:bg-[#1A2234] transition-colors border border-gray-800"
            >
              <span>Assignment: {
                assignmentFilter === "all" 
                  ? "All" 
                  : assignmentFilter === "assigned" 
                    ? "Assigned" 
                    : "Unassigned"
              }</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {assignmentFilter !== "all" && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-[#151C2C] rounded-lg shadow-xl border border-gray-800 z-10">
                <button
                  onClick={() => setAssignmentFilter("all")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  All
                </button>
                <button
                  onClick={() => setAssignmentFilter("assigned")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Assigned
                </button>
                <button
                  onClick={() => setAssignmentFilter("unassigned")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Unassigned
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
          <div key={client.id} className="bg-[#151C2C] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {client.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="text-white font-medium">{client.name}</h3>
                  <p className="text-sm text-gray-400">{client.email}</p>
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setActiveActionMenu(activeActionMenu === client.id ? null : client.id)}
                  className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
                {activeActionMenu === client.id && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-[#1A2234] rounded-lg shadow-xl border border-gray-800 z-10">
                    <button
                      onClick={(e) => {
                        // Prevent event bubbling
                        e.stopPropagation();
                        // Set the selected client
                        setSelectedClient(client);
                        // Close the action menu
                        setActiveActionMenu(null);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#212B42]"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="w-full px-4 py-2 text-left text-red-500 hover:bg-[#212B42]"
                    >
                      Remove Client
                    </button>
                  </div>
                )}
              </div>
            </div>              <div className="space-y-4">
                {client.isAssigned && (
                  <div className="mb-1">
                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-500">
                      Assigned Trainer
                    </span>
                  </div>
                )}
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm text-gray-200">{client.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${client.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Plan</p>
                    <span className={`px-2 py-1 rounded-lg text-sm font-medium
                      ${client.plan === "Weight Loss" 
                        ? "bg-green-500/10 text-green-500"
                        : client.plan === "Muscle Gain"
                        ? "bg-blue-500/10 text-blue-500"
                        : client.plan === "Athletic Performance"
                        ? "bg-purple-500/10 text-purple-500"
                        : "bg-gray-500/10 text-gray-300"
                      }`}>
                      {client.plan}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    <span className={`px-2 py-1 rounded-lg text-sm font-medium
                      ${client.status === "Active" 
                        ? "bg-green-500/10 text-green-500"
                        : client.status === "On Hold"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-blue-500/10 text-blue-500"
                      }`}>
                      {client.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Next Session</p>
                    <p className="text-gray-200">
                      {client.nextSession === "No upcoming sessions" 
                        ? client.nextSession 
                        : formatDate(client.nextSession)
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Last Workout</p>
                    <p className="text-gray-200">
                      {client.lastWorkout === "Not available"
                        ? client.lastWorkout
                        : formatDate(client.lastWorkout)
                      }
                    </p>
                  </div>
                </div>
                
                <div className="mt-2 text-sm">
                  <p className="text-gray-400">Sessions</p>
                  <p className="text-gray-200">
                    <span className="text-green-400">{client.sessionsCompleted}</span>
                    <span className="text-gray-500"> completed</span>
                    {client.sessionsUpcoming > 0 && (
                      <>
                        <span className="text-gray-500"> · </span>
                        <span className="text-blue-400">{client.sessionsUpcoming}</span>
                        <span className="text-gray-500"> upcoming</span>
                      </>
                    )}
                  </p>
                </div>
            </div>
          </div>
        ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-gray-700/30 flex items-center justify-center mb-4">
            <Search className="w-7 h-7 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No Matching Clients</h2>
          <p className="text-gray-400 text-center max-w-md">
            No clients match your current filter criteria. Try adjusting your filters or search query.
          </p>
          <button 
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setPlanFilter("all");
              setAssignmentFilter("all");
            }}
            className="mt-6 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Modals */}
      <AddClientModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddClient}
      />
      {/* Only render the modal when there's a selected client to avoid unnecessary renders */}
      {selectedClient !== null && (
        <ClientDetailsModal 
          isOpen={true}
          onClose={() => setSelectedClient(null)}
          client={selectedClient}
        />
      )}
    </div>
  );
}
