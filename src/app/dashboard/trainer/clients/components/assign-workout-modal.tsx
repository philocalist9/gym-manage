"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { X, Search, Check } from 'lucide-react';

interface WorkoutPlan {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  duration: string;
  description: string;
}

interface AssignWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  onAssign: (workoutIds: string[]) => void;
  currentWorkouts?: string[];
}

export default function AssignWorkoutModal({
  isOpen,
  onClose,
  clientId,
  onAssign,
  currentWorkouts = []
}: AssignWorkoutModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  // Initialize selectedWorkouts independently from props to avoid re-renders
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
  // Use a memoized workouts list to avoid unnecessary re-renders
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([
    {
      id: "1",
      name: "Full Body Strength",
      type: "Muscle Gain",
      difficulty: "Intermediate",
      duration: "60 min",
      description: "Comprehensive full body workout focusing on compound movements"
    },
    {
      id: "2",
      name: "HIIT Circuit",
      type: "Weight Loss",
      difficulty: "Advanced",
      duration: "45 min",
      description: "High-intensity interval training for maximum calorie burn"
    },
    // Add more sample workout plans as needed
  ]);

  // Initialize selectedWorkouts only once when the modal opens
  // Using a ref to track if this is the first time modal is opening
  const initializedRef = useRef(false);
  
  useEffect(() => {
    // Only set the workouts when the modal opens
    if (isOpen) {
      if (!initializedRef.current) {
        setSelectedWorkouts(currentWorkouts || []);
        initializedRef.current = true;
      }
    } else {
      // Reset the initialization flag when modal closes
      initializedRef.current = false;
    }
  }, [isOpen]);  // Only depend on isOpen to prevent infinite loops

  // Use useMemo to prevent recalculating on each render
  const filteredWorkouts = useMemo(() => {
    return workoutPlans.filter(workout =>
      workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [workoutPlans, searchQuery]);

  // Memoize this function to prevent recreation on each render
  const toggleWorkout = React.useCallback((workoutId: string) => {
    setSelectedWorkouts(prev =>
      prev.includes(workoutId)
        ? prev.filter(id => id !== workoutId)
        : [...prev, workoutId]
    );
  }, []);

  // Memoize the submit handler to prevent recreation on each render
  const handleSubmit = React.useCallback(() => {
    onAssign(selectedWorkouts);
    onClose();
  }, [onAssign, selectedWorkouts, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#151C2C] rounded-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Assign Workout Plans</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search workout plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Workout List */}
        <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
          {filteredWorkouts.map((workout) => (
            <div
              key={workout.id}
              onClick={() => toggleWorkout(workout.id)}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedWorkouts.includes(workout.id)
                  ? 'bg-blue-600/10 border border-blue-500'
                  : 'bg-[#1A2234] border border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-medium">{workout.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{workout.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium
                      ${workout.type === "Weight Loss"
                        ? "bg-green-500/10 text-green-500"
                        : workout.type === "Muscle Gain"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-purple-500/10 text-purple-500"
                      }`}>
                      {workout.type}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium
                      ${workout.difficulty === "Beginner"
                        ? "bg-green-500/10 text-green-500"
                        : workout.difficulty === "Intermediate"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-red-500/10 text-red-500"
                      }`}>
                      {workout.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-500/10 text-gray-400">
                      {workout.duration}
                    </span>
                  </div>
                </div>
                {selectedWorkouts.includes(workout.id) && (
                  <div className="p-1 bg-blue-500 rounded-full">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Assign Selected
          </button>
        </div>
      </div>
    </div>
  );
}
