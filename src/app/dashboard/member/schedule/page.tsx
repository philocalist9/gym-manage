"use client";

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Dumbbell, BarChart, CheckCircle2, XCircle, Clock3 } from 'lucide-react';

interface WorkoutSession {
  id: string;
  date: string;
  time: string;
  type: string;
  trainer: string;
  duration: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }[];
  status: 'completed' | 'upcoming' | 'missed';
}

export default function WorkoutSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const workouts: WorkoutSession[] = [
    {
      id: '1',
      date: '2025-05-15',
      time: '09:00',
      type: 'Strength Training',
      trainer: 'Mike Johnson',
      duration: '60 min',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: 10, weight: 80 },
        { name: 'Squats', sets: 4, reps: 12, weight: 100 },
        { name: 'Deadlifts', sets: 3, reps: 8, weight: 120 }
      ],
      status: 'completed'
    },
    {
      id: '2',
      date: '2025-05-15',
      time: '16:00',
      type: 'HIIT',
      trainer: 'Sarah Wilson',
      duration: '45 min',
      exercises: [
        { name: 'Burpees', sets: 3, reps: 15 },
        { name: 'Mountain Climbers', sets: 3, reps: 20 },
        { name: 'Jump Rope', sets: 4, reps: 50 }
      ],
      status: 'upcoming'
    }
  ];

  const getStatusColor = (status: WorkoutSession['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'upcoming':
        return 'text-blue-500';
      case 'missed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: WorkoutSession['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'upcoming':
        return <Clock3 className="w-5 h-5 text-blue-500" />;
      case 'missed':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-2">Workout Schedule</h1>
        <p className="text-gray-400">Track your training sessions and exercises</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Weekly Sessions</div>
            <Dumbbell className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-semibold text-white">5/6</div>
          <div className="text-sm text-green-500 mt-2">On track</div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Completion Rate</div>
            <BarChart className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-semibold text-white">92%</div>
          <div className="text-sm text-green-500 mt-2">+5% vs last week</div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Next Session</div>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-2xl font-semibold text-white">Today 4:00 PM</div>
          <div className="text-sm text-blue-500 mt-2">HIIT with Sarah</div>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="bg-[#151C2C] p-6 rounded-xl mb-8">
        <h2 className="text-lg font-medium text-white mb-4">This Week</h2>
        <div className="grid grid-cols-7 gap-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-gray-400 text-sm mb-2">{day}</div>
              <button 
                className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${index === 4 ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-[#1A2234]'}`}
              >
                {index + 12}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Workout Sessions */}
      <div className="space-y-4">
        {workouts.map((workout) => (
          <div key={workout.id} className="bg-[#151C2C] p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-4">
                <div className="bg-[#1A2234] p-3 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{workout.type}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{workout.time} ({workout.duration})</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{workout.trainer}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(workout.status)}
                <span className={getStatusColor(workout.status)}>
                  {workout.status.charAt(0).toUpperCase() + workout.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Exercise List */}
            {(showDetails === workout.id || workout.status === 'upcoming') && (
              <div className="mt-4 border-t border-gray-800 pt-4">
                <h4 className="text-white font-medium mb-3">Exercises</h4>
                <div className="space-y-3">
                  {workout.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="text-gray-400">{exercise.name}</div>
                      <div className="text-white">
                        {exercise.sets} × {exercise.reps} {exercise.weight && `@ ${exercise.weight}kg`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {workout.status !== 'upcoming' && (
              <button
                onClick={() => setShowDetails(showDetails === workout.id ? null : workout.id)}
                className="text-sm text-blue-500 hover:text-blue-400 mt-4"
              >
                {showDetails === workout.id ? 'Hide Details' : 'Show Details'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
