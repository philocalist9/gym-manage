"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { formatDate } from '@/app/utils/date-utils';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rest: string;
  notes?: string;
  completed?: boolean;
}

interface DayPlan {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  exercises: Exercise[];
}

interface WorkoutPlan {
  _id: string;
  planName: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
  notes?: string;
  trainerId: {
    _id: string;
    name: string;
  };
}

interface WorkoutProgress {
  planId: string;
  date: string; // ISO string format
  day: string;
  exercises: {
    name: string;
    completed: boolean;
  }[];
  completed: boolean;
}

export default function WorkoutProgressTrackerV2() {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [progressData, setProgressData] = useState<WorkoutProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todaysWorkout, setTodaysWorkout] = useState<{
    plan: WorkoutPlan;
    dayPlan: DayPlan;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  useEffect(() => {
    fetchWorkoutPlans();
  }, []);
  
  // Load progress data whenever we have a workout loaded
  useEffect(() => {
    if (todaysWorkout) {
      loadProgressData();
    }
  }, [todaysWorkout]);
  
  // Auto-hide notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  const fetchWorkoutPlans = async () => {
    try {
      setIsLoading(true);
      const today = new Date();
      
      const response = await fetch(
        `/api/members/workouts?startDate=${today.toISOString()}&endDate=${new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch workout plans');
      }
      
      const data = await response.json();
      if (data.success && data.workouts) {
        setWorkoutPlans(data.workouts);
        findTodaysWorkout(data.workouts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const findTodaysWorkout = (plans: WorkoutPlan[]) => {
    const today = new Date();
    const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][today.getDay()];
    
    console.log(`Looking for workouts for ${dayOfWeek}`);
    
    // Find a workout plan that includes today's date and has exercises for today
    for (const plan of plans) {
      const startDate = new Date(plan.startDate);
      const endDate = new Date(plan.endDate);
      
      if (today >= startDate && today <= endDate) {
        const todaysPlan = plan.days.find(day => day.day === dayOfWeek);
        
        if (todaysPlan && todaysPlan.exercises.length > 0) {
          console.log(`Found workout for today: ${plan.planName}`);
          setTodaysWorkout({
            plan,
            dayPlan: todaysPlan
          });
          return;
        }
      }
    }
    
    console.log('No workout found for today');
    setTodaysWorkout(null);
  };
  
  const loadProgressData = async () => {
    try {
      // Get today's date for filtering
      const today = new Date().toISOString().split('T')[0];
      
      console.log('Fetching workout progress for date:', today);
      const response = await fetch(`/api/members/workouts/progress?startDate=${today}&endDate=${today}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch workout progress: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Workout progress data received:', data);
      
      if (data.success && data.progress) {
        setProgressData(data.progress);
      } else {
        setProgressData([]); // Reset to empty array if no data
      }
    } catch (err) {
      console.error('Error loading progress data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    }
  };
  
  const saveProgressData = async (progressToSave: WorkoutProgress) => {
    try {
      setIsSaving(true);
      console.log('Saving progress:', progressToSave);
      
      const response = await fetch('/api/members/workouts/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: progressToSave.planId,
          date: progressToSave.date,
          day: progressToSave.day,
          exercises: progressToSave.exercises,
          completed: progressToSave.completed
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save progress: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Save response:', data);
      
      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Workout progress updated!'
        });
        
        // Update local state with the database result
        if (data.progress) {
          setProgressData(prevData => {
            const existingIndex = prevData.findIndex(p => 
              p.planId === progressToSave.planId && 
              new Date(p.date).toISOString().split('T')[0] === new Date(progressToSave.date).toISOString().split('T')[0]
            );
            
            if (existingIndex >= 0) {
              const updatedData = [...prevData];
              updatedData[existingIndex] = data.progress;
              return updatedData;
            } else {
              return [...prevData, data.progress];
            }
          });
        } else {
          // If no progress data returned, refresh all progress
          loadProgressData();
        }
      }
    } catch (err) {
      console.error('Error saving progress:', err);
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update progress'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleExerciseToggle = (exerciseName: string) => {
    if (!todaysWorkout || isSaving) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Find today's progress
    const existingProgress = progressData.find(p => {
      const progressDate = new Date(p.date).toISOString().split('T')[0];
      return p.planId === todaysWorkout.plan._id && progressDate === today;
    });
    
    if (existingProgress) {
      // Update existing progress
      const updatedProgress = {
        ...existingProgress,
        exercises: existingProgress.exercises.map(ex => ({
          ...ex,
          completed: ex.name === exerciseName ? !ex.completed : ex.completed
        }))
      };
      
      // Check if all exercises are now completed
      updatedProgress.completed = updatedProgress.exercises.every(ex => ex.completed);
      
      // Update the UI optimistically before saving
      setProgressData(prevData => {
        return prevData.map(p => 
          p.planId === existingProgress.planId && 
          new Date(p.date).toISOString().split('T')[0] === today 
            ? updatedProgress 
            : p
        );
      });
      
      // Save to the server
      saveProgressData(updatedProgress);
    } else {
      // Create new progress entry
      const newProgress: WorkoutProgress = {
        planId: todaysWorkout.plan._id,
        date: today,
        day: todaysWorkout.dayPlan.day,
        exercises: todaysWorkout.dayPlan.exercises.map(ex => ({
          name: ex.name,
          completed: ex.name === exerciseName
        })),
        completed: todaysWorkout.dayPlan.exercises.length === 1 && 
                  todaysWorkout.dayPlan.exercises[0].name === exerciseName
      };
      
      // Update the UI optimistically before saving
      setProgressData(prevData => [...prevData, newProgress]);
      
      // Save to the server
      saveProgressData(newProgress);
    }
  };
  
  const getExerciseStatus = (exerciseName: string): boolean => {
    if (!todaysWorkout) return false;
    
    const today = new Date().toISOString().split('T')[0];
    
    const todaysProgress = progressData.find(p => {
      const progressDate = new Date(p.date).toISOString().split('T')[0];
      return p.planId === todaysWorkout.plan._id && progressDate === today;
    });
    
    if (!todaysProgress) return false;
    
    const exercise = todaysProgress.exercises.find(ex => ex.name === exerciseName);
    return exercise?.completed || false;
  };
  
  const getCompletionPercentage = (): number => {
    if (!todaysWorkout) return 0;
    
    const today = new Date().toISOString().split('T')[0];
    
    const todaysProgress = progressData.find(p => {
      const progressDate = new Date(p.date).toISOString().split('T')[0];
      return p.planId === todaysWorkout.plan._id && progressDate === today;
    });
    
    if (!todaysProgress || todaysProgress.exercises.length === 0) return 0;
    
    const completedCount = todaysProgress.exercises.filter(ex => ex.completed).length;
    return Math.round((completedCount / todaysProgress.exercises.length) * 100);
  };
  
  if (isLoading) {
    return (
      <div className="bg-[#151C2C] rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-blue-500 w-5 h-5" />
          <h2 className="text-lg font-medium text-white">Today's Workout</h2>
        </div>
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-[#151C2C] rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-red-500 w-5 h-5" />
          <h2 className="text-lg font-medium text-white">Error</h2>
        </div>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }
  
  if (!todaysWorkout) {
    return (
      <div className="bg-[#151C2C] rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-blue-500 w-5 h-5" />
          <h2 className="text-lg font-medium text-white">Today's Workout</h2>
        </div>
        <p className="text-gray-400 text-center py-6">No workout scheduled for today.</p>
      </div>
    );
  }
  
  const completionPercentage = getCompletionPercentage();
  
  return (
    <div className="bg-[#151C2C] rounded-xl p-6 mb-8 relative">
      {notification && (
        <div className={`absolute top-4 right-4 p-3 rounded-lg flex items-center gap-2 ${
          notification.type === 'success' 
            ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
            : 'bg-red-500/10 text-red-400 border border-red-500/30'
        }`}>
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-black/20 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="text-blue-500 w-5 h-5" />
          <h2 className="text-lg font-medium text-white">Today's Workout</h2>
        </div>
        <div className="text-sm text-gray-400">
          {formatDate(new Date().toISOString())}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-white font-medium mb-2">{todaysWorkout.plan.planName}</h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-blue-400">{todaysWorkout.dayPlan.day}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">By {todaysWorkout.plan.trainerId.name}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-medium text-white">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-3">
        {todaysWorkout.dayPlan.exercises.map((exercise, index) => {
          const isCompleted = getExerciseStatus(exercise.name);
          
          return (
            <div 
              key={index}
              className={`p-4 rounded-lg flex items-center justify-between transition-all duration-200 ${
                isCompleted ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-[#1A2234] border border-gray-700'
              }`}
            >
              <div>
                <h4 className={`font-medium ${isCompleted ? 'text-blue-400' : 'text-white'}`}>
                  {exercise.name}
                </h4>
                <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                  <span>{exercise.sets} sets</span>
                  <span>•</span>
                  <span>{exercise.reps} reps</span>
                  <span>•</span>
                  <span>{exercise.rest} rest</span>
                </div>
              </div>
              
              <button
                onClick={() => handleExerciseToggle(exercise.name)}
                disabled={isSaving}
                className={`p-2 rounded-full transition-colors ${
                  isCompleted 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          );
        })}
        
        {/* For development testing only - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 border-t border-gray-700 pt-4">
            <button
              onClick={() => {
                localStorage.removeItem('workoutProgress');
                setProgressData([]);
                setNotification({
                  type: 'success',
                  message: 'Progress reset successfully'
                });
              }}
              className="w-full py-2 px-4 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 text-sm"
            >
              Reset Progress (Dev Only)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
