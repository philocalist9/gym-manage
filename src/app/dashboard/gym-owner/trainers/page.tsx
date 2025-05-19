"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, Filter, MoreVertical, ChevronDown } from "lucide-react";
import AddTrainerModal from "./components/add-trainer-modal";
import TrainerDetailsModal from "./components/trainer-details-modal";

interface Trainer {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  bio: string;
  experience: number;
  totalClients: number;
  rating: number;
  joinDate: string;
  salary?: number; // Salary in Indian Rupees (₹)
  phone?: string;
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for modals and filters
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  // Fetch trainers from the API
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/trainers');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch trainers');
        }
        
        const data = await response.json();          // Format trainer data from API response
        const formattedTrainers = data.trainers.map((trainer: any) => ({
          _id: trainer._id,
          name: trainer.name,
          email: trainer.email,
          specialization: trainer.specialization,
          bio: trainer.bio || "",
          experience: trainer.experience || 0,
          phone: trainer.phone,
          salary: trainer.salary || 0,
          totalClients: trainer.totalClients || 0,
          rating: trainer.rating || 5.0,
          joinDate: new Date(trainer.joinDate || trainer.createdAt).toISOString().split('T')[0],
        }));
        
        setTrainers(formattedTrainers);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching trainers');
        console.error('Error fetching trainers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  // Filter trainers based on search
  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      const matchesSearch = 
        trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.specialization.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [trainers, searchQuery]);

  // Handlers
  const handleAddTrainer = async (newTrainer: Omit<Trainer, "_id">) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/trainers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTrainer),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add trainer');
      }

      const data = await response.json();
      
      // Add the new trainer to the state
      setTrainers([...trainers, {
        ...data.trainer,
        joinDate: new Date(data.trainer.joinDate).toISOString().split('T')[0],
      }]);
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while adding the trainer');
      console.error('Error adding trainer:', err);
    } finally {
      setIsLoading(false);
      setIsAddModalOpen(false);
    }
  };

  const handleActionClick = (trainerId: string) => {
    setActiveActionMenu(activeActionMenu === trainerId ? null : trainerId);
  };

  const handleDeleteTrainer = async (id: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/trainers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete trainer');
      }
      
      // Update UI after successful deletion
      setTrainers(trainers.filter(t => t._id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the trainer');
      console.error('Error deleting trainer:', err);
    } finally {
      setIsLoading(false);
      setActiveActionMenu(null);
    }
  };

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Trainers</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Trainer</span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search trainers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#151C2C] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        {/* Status filter removed */}
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredTrainers.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          {trainers.length === 0 ? "No trainers found. Add your first trainer!" : "No trainers match your filters."}
        </div>
      ) : (
        // Trainers Table
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="pb-4 text-left text-gray-400 font-medium">Name</th>
                <th className="pb-4 text-left text-gray-400 font-medium">Email</th>
                <th className="pb-4 text-left text-gray-400 font-medium">Specialization</th>
                <th className="pb-4 text-left text-gray-400 font-medium">Salary (₹)</th>
                <th className="pb-4 text-left text-gray-400 font-medium">Clients</th>
                <th className="pb-4 text-left text-gray-400 font-medium">Rating</th>
                <th className="pb-4 text-left text-gray-400 font-medium">Join Date</th>
                <th className="pb-4 text-right text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainers.map((trainer) => (
                <tr 
                  key={trainer._id}
                  className="border-b border-gray-800 hover:bg-[#151C2C]/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedTrainer(trainer)}
                >
                  <td className="py-4 text-white font-medium">{trainer.name}</td>
                  <td className="py-4 text-gray-300">{trainer.email}</td>
                  <td className="py-4 text-gray-300">{trainer.specialization}</td>
                  <td className="py-4 text-gray-300">₹{trainer.salary?.toLocaleString('en-IN') || '0'}</td>
                  <td className="py-4 text-gray-300">{trainer.totalClients}</td>
                  <td className="py-4 text-gray-300">{trainer.rating.toFixed(1)}</td>
                  <td className="py-4 text-gray-300">{trainer.joinDate}</td>
                  <td className="py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => handleActionClick(trainer._id)}
                      className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    
                    {activeActionMenu === trainer._id && (
                      <div className="absolute top-full mt-1 right-0 w-48 bg-[#1A2234] rounded-lg border border-gray-800 shadow-xl overflow-hidden z-10">
                        <button 
                          onClick={() => setSelectedTrainer(trainer)}
                          className="px-4 py-2 w-full text-left hover:bg-[#232B3E] transition-colors text-gray-300"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => handleDeleteTrainer(trainer._id)}
                          className="px-4 py-2 w-full text-left hover:bg-[#232B3E] transition-colors text-red-500"
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
      )}
      
      {/* Add Trainer Modal */}
      <AddTrainerModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddTrainer} 
      />
      
      {/* Trainer Details Modal */}
      {selectedTrainer && (
        <TrainerDetailsModal 
          isOpen={!!selectedTrainer}
          trainer={selectedTrainer}
          onClose={() => setSelectedTrainer(null)}
        />
      )}
    </div>
  );
}
