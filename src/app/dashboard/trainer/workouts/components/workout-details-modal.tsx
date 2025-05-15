"use client";

import React, { useState } from "react";
import { X, BarChart2, Clock, Activity, Users } from "lucide-react";

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

interface WorkoutDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: WorkoutPlan | null;
}

export default function WorkoutDetailsModal({
  isOpen,
  onClose,
  workout
}: WorkoutDetailsModalProps) {
  if (!isOpen || !workout) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#151C2C] rounded-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">{workout.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Workout Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1A2234] p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Type</span>
            </div>
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
          </div>

          <div className="bg-[#1A2234] p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <BarChart2 className="w-4 h-4" />
              <span className="text-sm">Difficulty</span>
            </div>
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

          <div className="bg-[#1A2234] p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Duration</span>
            </div>
            <p className="text-white">{workout.duration}</p>
          </div>

          <div className="bg-[#1A2234] p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">Target</span>
            </div>
            <p className="text-white">{workout.targetMuscles.length} muscle groups</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#1A2234] p-4 rounded-lg mb-6">
          <h3 className="text-white font-medium mb-2">Description</h3>
          <p className="text-gray-400">{workout.description}</p>
        </div>

        {/* Target Muscles */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">Target Muscle Groups</h3>
          <div className="flex flex-wrap gap-2">
            {workout.targetMuscles.map((muscle, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#1A2234] text-gray-200 rounded-lg text-sm"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {/* Exercises */}
        <div>
          <h3 className="text-white font-medium mb-3">Exercises</h3>
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => (
              <div key={index} className="bg-[#1A2234] p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">{exercise.name}</h4>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-sm text-gray-400">Sets: </span>
                      <span className="text-gray-200">{exercise.sets}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Reps: </span>
                      <span className="text-gray-200">{exercise.reps}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Rest: </span>
                      <span className="text-gray-200">{exercise.rest}</span>
                    </div>
                  </div>
                </div>
                {exercise.notes && (
                  <p className="text-sm text-gray-400">{exercise.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Workout
          </button>
        </div>
      </div>
    </div>
  );
}
