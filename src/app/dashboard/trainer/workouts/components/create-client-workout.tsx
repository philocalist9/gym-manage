"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Minus, Calendar, ChevronDown } from "lucide-react";

interface Client {
  _id: string;
  name: string;
  email: string;
  membershipType: string;
  isAssigned: boolean;
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rest: string;
  notes?: string;
}

interface DayPlan {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  exercises: Exercise[];
}

interface WeeklyWorkoutPlan {
  clientId: string;
  planName: string;
  startDate: string; // ISO string format
  endDate: string; // ISO string format
  days: DayPlan[];
  notes?: string;
}

interface CreateClientWorkoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const days: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[] = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export default function CreateClientWorkout({ isOpen, onClose }: CreateClientWorkoutProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [activeDay, setActiveDay] = useState<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday">("Monday");
  
  const [workoutPlan, setWorkoutPlan] = useState<Omit<WeeklyWorkoutPlan, "clientId">>({
    planName: "Weekly Training Plan",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days later
    days: days.map(day => ({
      day,
      exercises: day === "Monday" ? [{ name: "", sets: 3, reps: 12, rest: "60 sec" }] : []
    })),
    notes: ""
  });

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/trainers/clients');
      
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      
      const data = await response.json();
      setClients(data.clients || []);
      
      // If there are clients, select the first one by default
      if (data.clients && data.clients.length > 0) {
        setSelectedClient(data.clients[0]._id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Error loading clients: ' + errorMessage);
      console.error("Error fetching clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDaySelect = (day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday") => {
    setActiveDay(day);
  };

  const handleAddExercise = () => {
    setWorkoutPlan(prevState => {
      const updatedDays = prevState.days.map(dayPlan => {
        if (dayPlan.day === activeDay) {
          return {
            ...dayPlan,
            exercises: [
              ...dayPlan.exercises,
              { name: "", sets: 3, reps: 12, rest: "60 sec" }
            ]
          };
        }
        return dayPlan;
      });
      
      return {
        ...prevState,
        days: updatedDays
      };
    });
  };

  const handleRemoveExercise = (exerciseIndex: number) => {
    setWorkoutPlan(prevState => {
      const updatedDays = prevState.days.map(dayPlan => {
        if (dayPlan.day === activeDay) {
          return {
            ...dayPlan,
            exercises: dayPlan.exercises.filter((_, index) => index !== exerciseIndex)
          };
        }
        return dayPlan;
      });
      
      return {
        ...prevState,
        days: updatedDays
      };
    });
  };

  const handleExerciseChange = (exerciseIndex: number, field: keyof Exercise, value: string | number) => {
    setWorkoutPlan(prevState => {
      const updatedDays = prevState.days.map(dayPlan => {
        if (dayPlan.day === activeDay) {
          const updatedExercises = dayPlan.exercises.map((exercise, index) => {
            if (index === exerciseIndex) {
              return {
                ...exercise,
                [field]: value
              };
            }
            return exercise;
          });
          
          return {
            ...dayPlan,
            exercises: updatedExercises
          };
        }
        return dayPlan;
      });
      
      return {
        ...prevState,
        days: updatedDays
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient) {
      setError("Please select a client");
      return;
    }
    
    // Validate that there's at least one exercise in the plan
    const hasExercises = workoutPlan.days.some(day => day.exercises.length > 0);
    if (!hasExercises) {
      setError("Please add at least one exercise to the workout plan");
      return;
    }
    
    // Validate that all exercises have names
    const hasEmptyExercises = workoutPlan.days.some(day => 
      day.exercises.some(exercise => !exercise.name.trim())
    );
    if (hasEmptyExercises) {
      setError("Please fill in all exercise names");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/trainers/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...workoutPlan,
          clientId: selectedClient
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create workout plan');
      }
      
      // Success
      const data = await response.json();
      console.log('Workout plan created:', data);
      
      // Reset form and close modal
      setSelectedClient("");
      setWorkoutPlan({
        planName: "Weekly Training Plan",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        days: days.map(day => ({
          day,
          exercises: day === "Monday" ? [{ name: "", sets: 3, reps: 12, rest: "60 sec" }] : []
        })),
        notes: ""
      });
      
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Error creating workout plan: ' + errorMessage);
      console.error("Error creating workout plan:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Display none if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-10">
      <div className="bg-[#151C2C] rounded-xl w-full max-w-5xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Create Weekly Workout Plan
        </h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Client Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="client">
                Select Client
              </label>
              <div className="relative">
                <select
                  id="client"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  disabled={isLoading || clients.length === 0}
                  className="w-full bg-[#1A2234] border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select a client</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
              {clients.length === 0 && !isLoading && (
                <p className="text-yellow-500 text-sm mt-1">No clients available. First assign clients or schedule appointments.</p>
              )}
            </div>
            
            {/* Plan Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="planName">
                Plan Name
              </label>
              <input
                type="text"
                id="planName"
                value={workoutPlan.planName}
                onChange={(e) => setWorkoutPlan({...workoutPlan, planName: e.target.value})}
                className="w-full bg-[#1A2234] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Weekly Strength Training"
              />
            </div>
            
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="startDate">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={workoutPlan.startDate}
                onChange={(e) => setWorkoutPlan({...workoutPlan, startDate: e.target.value})}
                className="w-full bg-[#1A2234] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="endDate">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={workoutPlan.endDate}
                onChange={(e) => setWorkoutPlan({...workoutPlan, endDate: e.target.value})}
                className="w-full bg-[#1A2234] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Day Selector Tabs */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex min-w-max border-b border-gray-700">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDaySelect(day)}
                  className={`py-2 px-4 font-medium text-sm whitespace-nowrap ${
                    activeDay === day 
                      ? "text-blue-500 border-b-2 border-blue-500" 
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          
          {/* Current Day Plan */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">Exercises for {activeDay}</h3>
              <button
                type="button"
                onClick={handleAddExercise}
                className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-400"
              >
                <Plus className="w-4 h-4" />
                Add Exercise
              </button>
            </div>
            
            {/* Exercises List */}
            <div className="space-y-4">
              {workoutPlan.days.find(d => d.day === activeDay)?.exercises.map((exercise, index) => (
                <div key={`${activeDay}-exercise-${index}`} className="bg-[#1A2234] p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-white font-medium">Exercise {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Exercise Name
                      </label>
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                        className="w-full bg-[#212B42] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., Barbell Squat"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Sets
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, "sets", parseInt(e.target.value))}
                        className="w-full bg-[#212B42] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Reps
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, "reps", parseInt(e.target.value))}
                        className="w-full bg-[#212B42] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Rest Time
                      </label>
                      <select
                        value={exercise.rest}
                        onChange={(e) => handleExerciseChange(index, "rest", e.target.value)}
                        className="w-full bg-[#212B42] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="30 sec">30 seconds</option>
                        <option value="45 sec">45 seconds</option>
                        <option value="60 sec">60 seconds</option>
                        <option value="90 sec">90 seconds</option>
                        <option value="120 sec">2 minutes</option>
                        <option value="180 sec">3 minutes</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={exercise.notes || ""}
                      onChange={(e) => handleExerciseChange(index, "notes", e.target.value)}
                      className="w-full bg-[#212B42] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., Focus on form, slow negative"
                    />
                  </div>
                </div>
              ))}
              
              {workoutPlan.days.find(d => d.day === activeDay)?.exercises.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No exercises added for {activeDay}</p>
                  <button
                    type="button"
                    onClick={handleAddExercise}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add Exercise
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Overall Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="notes">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={workoutPlan.notes || ""}
              onChange={(e) => setWorkoutPlan({...workoutPlan, notes: e.target.value})}
              rows={3}
              className="w-full bg-[#1A2234] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional instructions or notes for the entire workout plan..."
            ></textarea>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Workout Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
