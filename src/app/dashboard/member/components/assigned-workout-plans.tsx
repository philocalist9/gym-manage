"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronUp, Clock, User } from 'lucide-react';
import { formatDate } from '@/app/utils/date-utils';

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

interface WorkoutPlan {
  _id: string;
  trainerId: {
    _id: string;
    name: string;
  };
  planName: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
  notes?: string;
}

export default function AssignedWorkoutPlans() {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<{planId: string, day: string} | null>(null);

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const fetchWorkoutPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get current date and end of month for filtering
      const today = new Date();
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const response = await fetch(
        `/api/members/workouts?startDate=${today.toISOString()}&endDate=${endOfMonth.toISOString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch workout plans');
      }
      
      const data = await response.json();
      if (data.success && data.workouts) {
        setWorkoutPlans(data.workouts);
      } else {
        throw new Error(data.error || 'Failed to fetch workout plans');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching workout plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlanExpand = (planId: string) => {
    if (expandedPlan === planId) {
      setExpandedPlan(null);
      setExpandedDay(null);
    } else {
      setExpandedPlan(planId);
      setExpandedDay(null);
    }
  };

  const toggleDayExpand = (planId: string, day: string) => {
    if (expandedDay && expandedDay.planId === planId && expandedDay.day === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay({ planId, day });
    }
  };

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
  };
  
  // Check if today's workout plan is active
  const getCurrentDayPlan = (plan: WorkoutPlan) => {
    const today = new Date();
    const startDate = new Date(plan.startDate);
    const endDate = new Date(plan.endDate);
    
    // Check if today is within plan date range
    if (today >= startDate && today <= endDate) {
      const dayOfWeek = getDayOfWeek(today.toISOString()) as "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
      return plan.days.find(dayPlan => dayPlan.day === dayOfWeek);
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-[#151C2C] p-6 rounded-xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Assigned Workouts</h2>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#151C2C] p-6 rounded-xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Assigned Workouts</h2>
        </div>
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (workoutPlans.length === 0) {
    return (
      <div className="bg-[#151C2C] p-6 rounded-xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Assigned Workouts</h2>
        </div>
        <div className="text-center py-8 text-gray-400">
          <p>No workout plans have been assigned to you yet.</p>
          <p className="mt-2 text-sm">Your trainer will create workout plans for you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#151C2C] p-6 rounded-xl mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Assigned Workout Plans</h2>
        <div className="text-sm text-gray-400">
          {workoutPlans.length} {workoutPlans.length === 1 ? 'plan' : 'plans'} available
        </div>
      </div>

      <div className="space-y-4">
        {workoutPlans.map(plan => {
          const currentDayPlan = getCurrentDayPlan(plan);
          const isExpanded = expandedPlan === plan._id;
          
          return (
            <div key={plan._id} className="border border-gray-700 rounded-lg overflow-hidden">
              <div 
                className="p-4 bg-[#1A2234] flex items-center justify-between cursor-pointer"
                onClick={() => togglePlanExpand(plan._id)}
              >
                <div>
                  <h3 className="text-white font-medium">{plan.planName}</h3>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(plan.startDate)} - {formatDate(plan.endDate)}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <div className="text-sm text-gray-400">Created by</div>
                    <div className="text-white">{plan.trainerId.name}</div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-4 border-t border-gray-700">
                  {currentDayPlan && (
                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-md">
                      <h4 className="text-blue-400 font-medium flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Today's Workout ({currentDayPlan.day})
                      </h4>
                      <div className="mt-2 space-y-2">
                        {currentDayPlan.exercises.map((exercise, index) => (
                          <div key={index} className="bg-[#212B42] p-3 rounded-md">
                            <div className="font-medium text-white">{exercise.name}</div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                              <span>{exercise.sets} sets</span>
                              <span>{exercise.reps} reps</span>
                              <span>{exercise.rest} rest</span>
                            </div>
                            {exercise.notes && (
                              <div className="mt-2 text-xs text-gray-400 italic">
                                Note: {exercise.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {plan.days.map(dayPlan => {
                      const isDayExpanded = expandedDay && 
                                           expandedDay.planId === plan._id && 
                                           expandedDay.day === dayPlan.day;
                      
                      return (
                        <div key={dayPlan.day} className="border border-gray-700 rounded-md overflow-hidden">
                          <div 
                            className="p-3 bg-[#212B42] flex items-center justify-between cursor-pointer"
                            onClick={() => toggleDayExpand(plan._id, dayPlan.day)}
                          >
                            <div className="font-medium text-white">{dayPlan.day}</div>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-400 mr-2">
                                {dayPlan.exercises.length} {dayPlan.exercises.length === 1 ? 'exercise' : 'exercises'}
                              </span>
                              {isDayExpanded ? (
                                <ChevronUp className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                          
                          {isDayExpanded && dayPlan.exercises.length > 0 && (
                            <div className="p-3 space-y-2">
                              {dayPlan.exercises.map((exercise, index) => (
                                <div key={index} className="bg-[#1A2234] p-3 rounded-md">
                                  <div className="font-medium text-white">{exercise.name}</div>
                                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                                    <span>{exercise.sets} sets</span>
                                    <span>{exercise.reps} reps</span>
                                    <span>{exercise.rest} rest</span>
                                  </div>
                                  {exercise.notes && (
                                    <div className="mt-2 text-xs text-gray-400 italic">
                                      Note: {exercise.notes}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {plan.notes && (
                    <div className="mt-4 p-3 bg-[#212B42] rounded-md">
                      <h4 className="text-sm font-medium text-gray-400">Notes from Trainer:</h4>
                      <p className="mt-1 text-white">{plan.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
