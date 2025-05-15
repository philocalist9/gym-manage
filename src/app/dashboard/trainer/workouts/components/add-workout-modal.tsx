"use client";

import React, { useState } from "react";
import { X, Plus, Minus } from "lucide-react";

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

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (workout: Omit<WorkoutPlan, "id">) => void;
}

export default function AddWorkoutModal({
  isOpen,
  onClose,
  onAdd
}: AddWorkoutModalProps) {
  const [formData, setFormData] = useState<Omit<WorkoutPlan, "id">>({
    name: "",
    type: "Weight Loss",
    difficulty: "Beginner",
    duration: "60 min",
    exercises: [{ name: "", sets: 3, reps: 12, rest: "60 sec" }],
    targetMuscles: [],
    description: ""
  });

  const handleAddExercise = () => {
    setFormData({
      ...formData,
      exercises: [
        ...formData.exercises,
        { name: "", sets: 3, reps: 12, rest: "60 sec" }
      ]
    });
  };

  const handleRemoveExercise = (index: number) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index)
    });
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    const newExercises = [...formData.exercises];
    newExercises[index] = {
      ...newExercises[index],
      [field]: value
    };
    setFormData({
      ...formData,
      exercises: newExercises
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: "",
      type: "Weight Loss",
      difficulty: "Beginner",
      duration: "60 min",
      exercises: [{ name: "", sets: 3, reps: 12, rest: "60 sec" }],
      targetMuscles: [],
      description: ""
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#151C2C] rounded-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Create New Workout Plan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Workout Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as WorkoutPlan["type"] })}
                  className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="General Fitness">General Fitness</option>
                  <option value="Athletic Performance">Athletic Performance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as WorkoutPlan["difficulty"] })}
                  className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Duration
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="30 min">30 min</option>
                <option value="45 min">45 min</option>
                <option value="60 min">60 min</option>
                <option value="90 min">90 min</option>
                <option value="120 min">120 min</option>
              </select>
            </div>

            {/* Target Muscles */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Target Muscle Groups
              </label>
              <input
                type="text"
                value={formData.targetMuscles.join(", ")}
                onChange={(e) => setFormData({
                  ...formData,
                  targetMuscles: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                })}
                placeholder="E.g. Chest, Back, Legs (comma separated)"
                className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Exercises */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-400">
                  Exercises
                </label>
                <button
                  type="button"
                  onClick={handleAddExercise}
                  className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-400"
                >
                  <Plus className="w-4 h-4" />
                  Add Exercise
                </button>
              </div>
              <div className="space-y-3">
                {formData.exercises.map((exercise, index) => (
                  <div key={index} className="bg-[#1A2234] p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                        placeholder="Exercise name"
                        required
                        className="flex-1 px-4 py-2 bg-[#212B42] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(index)}
                          className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-[#212B42] rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Sets</label>
                        <input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => handleExerciseChange(index, "sets", parseInt(e.target.value))}
                          min="1"
                          className="w-full px-3 py-1 bg-[#212B42] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Reps</label>
                        <input
                          type="number"
                          value={exercise.reps}
                          onChange={(e) => handleExerciseChange(index, "reps", parseInt(e.target.value))}
                          min="1"
                          className="w-full px-3 py-1 bg-[#212B42] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Rest</label>
                        <select
                          value={exercise.rest}
                          onChange={(e) => handleExerciseChange(index, "rest", e.target.value)}
                          className="w-full px-3 py-1 bg-[#212B42] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                        >
                          <option value="30 sec">30 sec</option>
                          <option value="45 sec">45 sec</option>
                          <option value="60 sec">60 sec</option>
                          <option value="90 sec">90 sec</option>
                          <option value="120 sec">120 sec</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
