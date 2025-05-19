"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Dumbbell } from 'lucide-react';
import { formatDate } from '@/app/utils/date-utils';
import Link from 'next/link';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
}

interface DayPlan {
  day: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  _id: string;
  planName: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
}

export default function WorkoutSummaryWidget() {
  const [upcomingWorkout, setUpcomingWorkout] = useState<{plan: WorkoutPlan, dayPlan: DayPlan} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingWorkouts();
  }, []);

  const fetchUpcomingWorkouts = async () => {
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
      if (data.success && data.workouts && data.workouts.length > 0) {
        findUpcomingWorkout(data.workouts);
      } else {
        setUpcomingWorkout(null);
      }
    } catch (err) {
      console.error('Error fetching upcoming workouts:', err);
      setUpcomingWorkout(null);
    } finally {
      setIsLoading(false);
    }
  };

  const findUpcomingWorkout = (workoutPlans: WorkoutPlan[]) => {
    const today = new Date();
    const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][today.getDay()];
    let foundTodayWorkout = false;
    
    // First check if there's a workout for today
    for (const plan of workoutPlans) {
      const startDate = new Date(plan.startDate);
      const endDate = new Date(plan.endDate);
      
      if (today >= startDate && today <= endDate) {
        const todaysPlan = plan.days.find(day => day.day === dayOfWeek);
        
        if (todaysPlan && todaysPlan.exercises.length > 0) {
          setUpcomingWorkout({
            plan,
            dayPlan: todaysPlan
          });
          foundTodayWorkout = true;
          break;
        }
      }
    }
    
    // If no workout for today, find the next upcoming workout
    if (!foundTodayWorkout) {
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const todayIndex = today.getDay();
      
      // Check the next 6 days (rest of the week)
      for (let i = 1; i <= 6; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);
        const nextDayName = weekdays[nextDay.getDay()];
        
        for (const plan of workoutPlans) {
          const startDate = new Date(plan.startDate);
          const endDate = new Date(plan.endDate);
          
          if (nextDay >= startDate && nextDay <= endDate) {
            const nextDayPlan = plan.days.find(day => day.day === nextDayName);
            
            if (nextDayPlan && nextDayPlan.exercises.length > 0) {
              setUpcomingWorkout({
                plan,
                dayPlan: nextDayPlan
              });
              return; // Found the next workout, exit
            }
          }
        }
      }
      
      // If still no workout found, just use the first one in the list
      if (workoutPlans.length > 0) {
        const firstPlan = workoutPlans[0];
        const firstDayWithExercises = firstPlan.days.find(day => day.exercises.length > 0);
        
        if (firstDayWithExercises) {
          setUpcomingWorkout({
            plan: firstPlan,
            dayPlan: firstDayWithExercises
          });
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#151C2C] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">Workout Plan</h2>
          <div className="w-6 h-6 rounded-full border-t-2 border-blue-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!upcomingWorkout) {
    return (
      <div className="bg-[#151C2C] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Dumbbell className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-medium text-white">Workout Plan</h2>
        </div>
        <div className="text-center py-4">
          <p className="text-gray-400 mb-3">No upcoming workouts scheduled</p>
          <Link 
            href="/dashboard/member/schedule"
            className="text-blue-500 hover:text-blue-400 text-sm inline-flex items-center"
          >
            View Schedule
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#151C2C] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-medium text-white">Workout Plan</h2>
        </div>
        <span className="text-sm text-gray-400">{upcomingWorkout.dayPlan.day}</span>
      </div>
      
      <div className="mb-3">
        <h3 className="text-white font-medium">{upcomingWorkout.plan.planName}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
          <Calendar className="w-4 h-4" />
          <span>
            {formatDate(upcomingWorkout.plan.startDate)} - {formatDate(upcomingWorkout.plan.endDate)}
          </span>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {upcomingWorkout.dayPlan.exercises.slice(0, 3).map((exercise, index) => (
          <div key={index} className="bg-[#1A2234] p-3 rounded-lg">
            <p className="text-white">{exercise.name}</p>
            <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
              <span>{exercise.sets} sets</span>
              <span>•</span>
              <span>{exercise.reps} reps</span>
            </div>
          </div>
        ))}
        
        {upcomingWorkout.dayPlan.exercises.length > 3 && (
          <div className="text-center text-sm text-gray-400">
            +{upcomingWorkout.dayPlan.exercises.length - 3} more exercises
          </div>
        )}
      </div>
      
      <Link 
        href="/dashboard/member/schedule"
        className="text-blue-500 hover:text-blue-400 text-sm flex items-center justify-center"
      >
        View Full Schedule
        <ChevronRight className="w-4 h-4 ml-1" />
      </Link>
    </div>
  );
}
