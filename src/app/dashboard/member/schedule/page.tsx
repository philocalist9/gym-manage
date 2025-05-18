"use client";

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Dumbbell, BarChart, CheckCircle2, XCircle, Clock3, Plus, X, Save, Trash2 } from 'lucide-react';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

interface WorkoutSession {
  id: string;
  date: string;
  time: string;
  type: string;
  trainer: string; // Can be "Self" for custom workouts
  duration: string;
  exercises: Exercise[];
  status: 'completed' | 'upcoming' | 'missed';
  isCustom?: boolean; // Flag to identify custom workouts
}

export default function WorkoutSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [isAddWorkoutModalOpen, setIsAddWorkoutModalOpen] = useState(false);
  const [workoutFormData, setWorkoutFormData] = useState<Omit<WorkoutSession, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'Custom Workout',
    trainer: 'Self',
    duration: '60 min',
    exercises: [],
    status: 'upcoming',
    isCustom: true
  });
  const [newExercise, setNewExercise] = useState<Exercise>({
    name: '',
    sets: 3,
    reps: 10,
    weight: undefined
  });

  const [workouts, setWorkouts] = useState<WorkoutSession[]>([
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
  ]);

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

  // Function to add a new exercise to the workout form
  const addExerciseToWorkout = () => {
    if (newExercise.name.trim() === '') return;
    
    setWorkoutFormData({
      ...workoutFormData,
      exercises: [...workoutFormData.exercises, { ...newExercise }]
    });
    
    // Reset the form for the next exercise
    setNewExercise({
      name: '',
      sets: 3,
      reps: 10,
      weight: undefined
    });
  };

  // Function to remove an exercise from the workout form
  const removeExercise = (index: number) => {
    const updatedExercises = [...workoutFormData.exercises];
    updatedExercises.splice(index, 1);
    setWorkoutFormData({
      ...workoutFormData,
      exercises: updatedExercises
    });
  };

  // Function to save the new workout
  const saveWorkout = () => {
    if (workoutFormData.exercises.length === 0) {
      alert('Please add at least one exercise to your workout.');
      return;
    }

    const newWorkout: WorkoutSession = {
      ...workoutFormData,
      id: `custom-${Date.now()}` // Generate a unique ID
    };

    setWorkouts([...workouts, newWorkout]);
    setIsAddWorkoutModalOpen(false);
    
    // Reset form data for next time
    setWorkoutFormData({
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      type: 'Custom Workout',
      trainer: 'Self',
      duration: '60 min',
      exercises: [],
      status: 'upcoming',
      isCustom: true
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">Workout Schedule</h1>
          <p className="text-gray-400">Track your training sessions and exercises</p>
        </div>
        <button
          onClick={() => setIsAddWorkoutModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Workout</span>
        </button>
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-white">Your Sessions</h2>
        <div className="text-sm text-gray-400">{workouts.filter(w => w.isCustom).length} custom workouts</div>
      </div>
      <div className="space-y-4">
        {workouts.map((workout) => (
          <div key={workout.id} className="bg-[#151C2C] p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-4">
                <div className="bg-[#1A2234] p-3 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-white">{workout.type}</h3>
                    {workout.isCustom && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        Custom
                      </span>
                    )}
                  </div>
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
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setShowDetails(showDetails === workout.id ? null : workout.id)}
                  className="text-sm text-blue-500 hover:text-blue-400"
                >
                  {showDetails === workout.id ? 'Hide Details' : 'Show Details'}
                </button>
                
                {workout.isCustom && (
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this workout?')) {
                        setWorkouts(workouts.filter(w => w.id !== workout.id));
                      }
                    }}
                    className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Workout Modal */}
      {isAddWorkoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#151C2C] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#151C2C] p-6 pb-3 z-10 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Add Your Own Workout</h2>
                <button
                  onClick={() => setIsAddWorkoutModalOpen(false)}
                  className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Workout Type</label>
                    <input
                      type="text"
                      value={workoutFormData.type}
                      onChange={(e) => setWorkoutFormData({ ...workoutFormData, type: e.target.value })}
                      placeholder="E.g., Upper Body, Cardio, etc."
                      className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Duration</label>
                    <input
                      type="text"
                      value={workoutFormData.duration}
                      onChange={(e) => setWorkoutFormData({ ...workoutFormData, duration: e.target.value })}
                      placeholder="E.g., 45 min, 1 hour"
                      className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={workoutFormData.date}
                      onChange={(e) => setWorkoutFormData({ ...workoutFormData, date: e.target.value })}
                      className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Time</label>
                    <input
                      type="time"
                      value={workoutFormData.time}
                      onChange={(e) => setWorkoutFormData({ ...workoutFormData, time: e.target.value })}
                      className="w-full px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Exercises Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Exercises</label>
                  
                  {/* Exercise List */}
                  {workoutFormData.exercises.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {workoutFormData.exercises.map((exercise, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-3 bg-[#1A2234] border border-gray-800 rounded-lg"
                        >
                          <div className="flex-grow">
                            <div className="font-medium text-white">{exercise.name}</div>
                            <div className="text-sm text-gray-400">
                              {exercise.sets} sets × {exercise.reps} reps
                              {exercise.weight && ` @ ${exercise.weight}kg`}
                            </div>
                          </div>
                          <button 
                            onClick={() => removeExercise(index)}
                            className="p-1.5 text-red-500 hover:bg-gray-800 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Add Exercise Form */}
                  <div className="bg-[#1A2234] p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Exercise name"
                          value={newExercise.name}
                          onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                          className="w-full px-3 py-2 bg-[#151C2C] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Sets"
                          value={newExercise.sets}
                          min={1}
                          onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) || 1 })}
                          className="w-full px-3 py-2 bg-[#151C2C] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Reps"
                          value={newExercise.reps}
                          min={1}
                          onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) || 1 })}
                          className="w-full px-3 py-2 bg-[#151C2C] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="flex-grow">
                        <label className="block text-xs text-gray-400 mb-1">Weight (optional)</label>
                        <div className="flex">
                          <input
                            type="number"
                            placeholder="Weight"
                            value={newExercise.weight || ''}
                            onChange={(e) => 
                              setNewExercise({ 
                                ...newExercise, 
                                weight: e.target.value === '' ? undefined : parseInt(e.target.value) 
                              })
                            }
                            className="w-full px-3 py-2 bg-[#151C2C] border border-gray-800 rounded-l-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                          />
                          <span className="px-3 py-2 bg-[#151C2C] border border-l-0 border-gray-800 rounded-r-lg text-gray-400">kg</span>
                        </div>
                      </div>
                      <button
                        onClick={addExerciseToWorkout}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-gray-800 flex justify-end gap-3">
                  <button
                    onClick={() => setIsAddWorkoutModalOpen(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveWorkout}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Workout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
