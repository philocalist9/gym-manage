"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Filter, MoreVertical, ChevronDown } from "lucide-react";
import AddTrainerModal from "./components/add-trainer-modal";
import TrainerDetailsModal from "./components/trainer-details-modal";

interface Trainer {
  id: string;
  name: string;
  email: string;
  specialization: string;
  status: "Available" | "In Session" | "Off Duty";
  totalClients: number;
  rating: number;
  joinDate: string;
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@gymsync.com",
      specialization: "Weight Training",
      status: "Available",
      totalClients: 15,
      rating: 4.8,
      joinDate: "2025-01-15",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@gymsync.com",
      specialization: "Yoga",
      status: "In Session",
      totalClients: 20,
      rating: 4.9,
      joinDate: "2024-11-20",
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike.w@gymsync.com",
      specialization: "CrossFit",
      status: "Off Duty",
      totalClients: 12,
      rating: 4.7,
      joinDate: "2025-02-01",
    },
  ]);

  // States for modals and filters
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  // Filter trainers based on search and status
  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      const matchesSearch = 
        trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.specialization.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === "all" || trainer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [trainers, searchQuery, statusFilter]);

  // Handlers
  const handleAddTrainer = (newTrainer: Omit<Trainer, "id">) => {
    const id = (trainers.length + 1).toString();
    setTrainers([...trainers, { ...newTrainer, id }]);
  };

  const handleActionClick = (trainerId: string) => {
    setActiveActionMenu(activeActionMenu === trainerId ? null : trainerId);
  };

  const handleDeleteTrainer = (id: string) => {
    setTrainers(trainers.filter(t => t.id !== id));
    setActiveActionMenu(null);
  };

  return (
    <div className="p-8 bg-[#0B101B] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-white">Trainers</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Trainer</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search trainers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#151C2C] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setStatusFilter(statusFilter === "all" ? "Available" : "all")}
            className="flex items-center gap-2 px-4 py-2 bg-[#151C2C] text-gray-200 rounded-lg hover:bg-[#1A2234] transition-colors border border-gray-800"
          >
            <Filter className="w-5 h-5" />
            <span>Status: {statusFilter === "all" ? "All" : statusFilter}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {statusFilter !== "all" && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-[#151C2C] rounded-lg shadow-xl border border-gray-800">
              <button
                onClick={() => setStatusFilter("all")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("Available")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                Available
              </button>
              <button
                onClick={() => setStatusFilter("In Session")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                In Session
              </button>
              <button
                onClick={() => setStatusFilter("Off Duty")}
                className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
              >
                Off Duty
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Trainers Table */}
      <div className="bg-[#151C2C] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1A2234] text-gray-400 text-sm">
            <tr>
              <th className="text-left py-4 px-6 font-medium">Name</th>
              <th className="text-left py-4 px-6 font-medium">Specialization</th>
              <th className="text-left py-4 px-6 font-medium">Status</th>
              <th className="text-left py-4 px-6 font-medium">Total Clients</th>
              <th className="text-left py-4 px-6 font-medium">Rating</th>
              <th className="text-left py-4 px-6 font-medium">Join Date</th>
              <th className="text-left py-4 px-6 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredTrainers.map((trainer) => (
              <tr key={trainer.id} className="hover:bg-[#1A2234] transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => setSelectedTrainer(trainer)}
                      className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium cursor-pointer"
                    >
                      {trainer.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-white font-medium">{trainer.name}</p>
                      <p className="text-sm text-gray-400">{trainer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-200">{trainer.specialization}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${trainer.status === "Available" 
                      ? "bg-green-500/10 text-green-500"
                      : trainer.status === "In Session"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-yellow-500/10 text-yellow-500"
                    }`}>
                    {trainer.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-200">{trainer.totalClients}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-gray-200">{trainer.rating}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-200">
                  {new Date(trainer.joinDate).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 relative">
                  <button 
                    onClick={() => handleActionClick(trainer.id)}
                    className="p-2 hover:bg-[#212B42] rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                  {activeActionMenu === trainer.id && (
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-[#151C2C] rounded-lg shadow-xl border border-gray-800">
                      <button
                        onClick={() => {
                          setSelectedTrainer(trainer);
                          setActiveActionMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteTrainer(trainer.id)}
                        className="w-full px-4 py-2 text-left text-red-500 hover:bg-[#1A2234]"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddTrainerModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTrainer}
      />
      <TrainerDetailsModal 
        isOpen={selectedTrainer !== null}
        onClose={() => setSelectedTrainer(null)}
        trainer={selectedTrainer}
      />
    </div>
  );
}
