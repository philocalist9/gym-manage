"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Filter, MoreVertical, ChevronDown } from "lucide-react";
import { formatDate } from "@/app/utils/date-utils";
import ClientDetailsModal from "./components/client-details-modal";
import AddClientModal from "./components/add-client-modal";

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
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.d@example.com",
      plan: "Weight Loss",
      status: "Active",
      startDate: "2025-01-15",
      nextSession: "2025-05-16",
      progress: 75,
      goals: ["Lose 10kg", "Improve endurance", "Build core strength"],
      lastWorkout: "2025-05-14"
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
      lastWorkout: "2025-05-15"
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.j@example.com",
      plan: "Athletic Performance",
      status: "On Hold",
      startDate: "2025-03-10",
      nextSession: "2025-05-20",
      progress: 85,
      goals: ["Improve speed", "Enhance agility", "Increase power"],
      lastWorkout: "2025-05-13"
    }
  ]);

  // States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === "all" || client.status === statusFilter;

      const matchesPlan =
        planFilter === "all" || client.plan === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [clients, searchQuery, statusFilter, planFilter]);

  // Handlers
  const handleAddClient = (newClient: Omit<Client, "id">) => {
    const id = (clients.length + 1).toString();
    setClients([...clients, { ...newClient, id }]);
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    setActiveActionMenu(null);
  };

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
        </div>
      </div>

      {/* Clients Grid */}
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
                      onClick={() => {
                        setSelectedClient(client);
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
            </div>

            <div className="space-y-4">
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
                  <p className="text-gray-200">{formatDate(client.nextSession)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Last Workout</p>
                  <p className="text-gray-200">{formatDate(client.lastWorkout)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddClientModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddClient}
      />
      <ClientDetailsModal 
        isOpen={selectedClient !== null}
        onClose={() => setSelectedClient(null)}
        client={selectedClient}
      />
    </div>
  );
}
