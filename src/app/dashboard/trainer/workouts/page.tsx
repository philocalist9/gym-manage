"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, ChevronDown, MoreVertical, Users, Dumbbell, ClipboardList } from "lucide-react";
import AddWorkoutModal from "./components/add-workout-modal";
import WorkoutDetailsModal from "./components/workout-details-modal";
import CreateClientWorkout from "./components/create-client-workout";
import ClientWorkoutView from "./components/client-workout-view";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rest: string;
  notes?: string;
}

interface WorkoutPlan {
  id: string;
  name: string;
  type: "Weight Loss" | "Muscle Gain" | "General Fitness" | "Athletic Performance";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  exercises: Exercise[];
  targetMuscles: string[];
  description: string;
}

export default function WorkoutPlansPage() {
  const [isCreateClientWorkoutOpen, setIsCreateClientWorkoutOpen] = useState(false);
  const [isClientWorkoutViewOpen, setIsClientWorkoutViewOpen] = useState(false);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([
    {
      id: "1",
      name: "Full Body Strength",
      type: "Muscle Gain",
      difficulty: "Intermediate",
      duration: "60 min",
      exercises: [
        {
          name: "Barbell Squat",
          sets: 4,
          reps: 8,
          rest: "90 sec",
          notes: "Focus on form and depth"
        },
        {
          name: "Bench Press",
          sets: 4,
          reps: 8,
          rest: "90 sec",
          notes: "Control the negative"
        },
        {
          name: "Deadlift",
          sets: 3,
          reps: 6,
          rest: "120 sec",
          notes: "Keep back straight"
        }
      ],
      targetMuscles: ["Legs", "Chest", "Back"],
      description: "Comprehensive full body workout focusing on compound movements"
    },
    {
      id: "2",
      name: "HIIT Circuit",
      type: "Weight Loss",
      difficulty: "Advanced",
      duration: "45 min",
      exercises: [
        {
          name: "Burpees",
          sets: 3,
          reps: 15,
          rest: "30 sec"
        },
        {
          name: "Mountain Climbers",
          sets: 3,
          reps: 30,
          rest: "30 sec"
        },
        {
          name: "Jump Rope",
          sets: 3,
          reps: 50,
          rest: "30 sec"
        }
      ],
      targetMuscles: ["Full Body", "Cardio"],
      description: "High-intensity interval training for maximum calorie burn"
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  // Filter workouts
  const filteredWorkouts = workoutPlans.filter((workout) => {
    const matchesSearch = 
      workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = 
      typeFilter === "all" || workout.type === typeFilter;

    const matchesDifficulty =
      difficultyFilter === "all" || workout.difficulty === difficultyFilter;

    return matchesSearch && matchesType && matchesDifficulty;
  });

  // Handlers
  const handleAddWorkout = (newWorkout: Omit<WorkoutPlan, "id">) => {
    const id = (workoutPlans.length + 1).toString();
    setWorkoutPlans([...workoutPlans, { ...newWorkout, id }]);
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkoutPlans(workoutPlans.filter(w => w.id !== id));
    setActiveActionMenu(null);
  };

  return (
    <div className="p-8 bg-[#0B101B] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Workout Plans</h1>
          <p className="text-gray-400">Create and manage workout routines</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsClientWorkoutViewOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ClipboardList className="w-5 h-5" />
            <span>View Client Plans</span>
          </button>
          <button 
            onClick={() => setIsCreateClientWorkoutOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>Create Client Plan</span>
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Dumbbell className="w-5 h-5" />
            <span>Add Template</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#151C2C] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-3">
          {/* Type Filter */}
          <div className="relative">
            <button 
              onClick={() => setTypeFilter(typeFilter === "all" ? "Weight Loss" : "all")}
              className="flex items-center gap-2 px-4 py-2 bg-[#151C2C] text-gray-200 rounded-lg hover:bg-[#1A2234] transition-colors border border-gray-800"
            >
              <Filter className="w-5 h-5" />
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
                  onClick={() => setTypeFilter("Weight Loss")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Weight Loss
                </button>
                <button
                  onClick={() => setTypeFilter("Muscle Gain")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Muscle Gain
                </button>
                <button
                  onClick={() => setTypeFilter("General Fitness")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  General Fitness
                </button>
                <button
                  onClick={() => setTypeFilter("Athletic Performance")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Athletic Performance
                </button>
              </div>
            )}
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <button 
              onClick={() => setDifficultyFilter(difficultyFilter === "all" ? "Beginner" : "all")}
              className="flex items-center gap-2 px-4 py-2 bg-[#151C2C] text-gray-200 rounded-lg hover:bg-[#1A2234] transition-colors border border-gray-800"
            >
              <span>Difficulty: {difficultyFilter === "all" ? "All" : difficultyFilter}</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {difficultyFilter !== "all" && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-[#151C2C] rounded-lg shadow-xl border border-gray-800 z-10">
                <button
                  onClick={() => setDifficultyFilter("all")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  All
                </button>
                <button
                  onClick={() => setDifficultyFilter("Beginner")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Beginner
                </button>
                <button
                  onClick={() => setDifficultyFilter("Intermediate")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Intermediate
                </button>
                <button
                  onClick={() => setDifficultyFilter("Advanced")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Advanced
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Workout Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkouts.map((workout) => (
          <div key={workout.id} className="bg-[#151C2C] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">{workout.name}</h3>
              <div className="relative">
                <button 
                  onClick={() => setActiveActionMenu(activeActionMenu === workout.id ? null : workout.id)}
                  className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
                {activeActionMenu === workout.id && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-[#1A2234] rounded-lg shadow-xl border border-gray-800 z-10">
                    <button
                      onClick={() => {
                        setSelectedWorkout(workout);
                        setActiveActionMenu(null);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#212B42]"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="w-full px-4 py-2 text-left text-red-500 hover:bg-[#212B42]"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-lg text-sm font-medium
                  ${workout.type === "Weight Loss"
                    ? "bg-green-500/10 text-green-500"
                    : workout.type === "Muscle Gain"
                    ? "bg-blue-500/10 text-blue-500"
                    : workout.type === "Athletic Performance"
                    ? "bg-purple-500/10 text-purple-500"
                    : "bg-gray-500/10 text-gray-300"
                  }`}>
                  {workout.type}
                </span>
                <span className={`px-2 py-1 rounded-lg text-sm font-medium
                  ${workout.difficulty === "Beginner"
                    ? "bg-green-500/10 text-green-500"
                    : workout.difficulty === "Intermediate"
                    ? "bg-yellow-500/10 text-yellow-500"
                    : "bg-red-500/10 text-red-500"
                  }`}>
                  {workout.difficulty}
                </span>
              </div>

              <p className="text-sm text-gray-400">{workout.description}</p>

              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-400">
                    <span className="text-white font-medium">{workout.exercises.length}</span> exercises
                  </div>
                  <div className="text-gray-400">
                    Duration: <span className="text-white">{workout.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddWorkoutModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddWorkout}
      />
      <WorkoutDetailsModal 
        isOpen={selectedWorkout !== null}
        onClose={() => setSelectedWorkout(null)}
        workout={selectedWorkout}
      />
      <CreateClientWorkout
        isOpen={isCreateClientWorkoutOpen}
        onClose={() => setIsCreateClientWorkoutOpen(false)}
      />
      <ClientWorkoutView
        isOpen={isClientWorkoutViewOpen}
        onClose={() => setIsClientWorkoutViewOpen(false)}
      />
    </div>
  );
}
