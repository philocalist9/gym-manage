"use client";

import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '@/app/utils/date-utils';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

interface WorkoutSession {
  id: string;
  date: string;
  type: string;
  exercises: Exercise[];
  status: '✅' | '⏳' | '❌';
  completed: boolean;
}

export default function WorkoutSchedule() {
  const [weeklyWorkouts] = useState<WorkoutSession[]>([
    {
      id: '1',
      date: '2025-05-15',
      type: 'Upper Body Strength',
      exercises: [
        { name: 'Bench Press', sets: 3, reps: 10, weight: 60 },
        { name: 'Pull-ups', sets: 3, reps: 8 }
      ],
      status: '⏳',
      completed: false
    },
    {
      id: '2',
      date: '2025-05-16',
      type: 'Lower Body',
      exercises: [
        { name: 'Squats', sets: 4, reps: 10, weight: 80 },
        { name: 'Deadlifts', sets: 3, reps: 8, weight: 100 }
      ],
      status: '⏳',
      completed: false
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '✅':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case '⏳':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case '❌':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 bg-[#151C2C] rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Weekly Workout Schedule</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add Workout
        </button>
      </div>

      <div className="space-y-4">
        {weeklyWorkouts.map((workout) => (
          <div key={workout.id} className="bg-[#1A2234] p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="text-white font-medium">{workout.type}</h3>
                  <p className="text-sm text-gray-400">{formatDate(workout.date)}</p>
                </div>
              </div>
              {getStatusIcon(workout.status)}
            </div>

            <div className="space-y-2">
              {workout.exercises.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between text-sm text-gray-400">
                  <span>{exercise.name}</span>
                  <span>
                    {exercise.sets} × {exercise.reps} {exercise.weight && `@ ${exercise.weight}kg`}
                  </span>
                </div>
              ))}
            </div>

            {!workout.completed && (
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  Mark Complete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
