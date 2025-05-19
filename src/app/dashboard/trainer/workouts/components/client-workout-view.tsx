"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "@/app/utils/date-utils-consolidated";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rest: string;
  notes?: string;
}

interface DayPlan {
  day: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  _id: string;
  clientId: string;
  planName: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
  notes?: string;
  createdAt: string;
}

interface Client {
  _id: string;
  name: string;
}

interface ClientWorkoutViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClientWorkoutView({ isOpen, onClose }: ClientWorkoutViewProps) {
  const [clientPlans, setClientPlans] = useState<{ client: Client; plans: WorkoutPlan[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchClientWorkouts();
    }
  }, [isOpen]);

  const fetchClientWorkouts = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all client workouts
      const response = await fetch('/api/trainers/workouts');
      
      if (!response.ok) {
        throw new Error("Failed to fetch workout plans");
      }
      
      const data = await response.json();
      
      if (!data.workouts || data.workouts.length === 0) {
        setClientPlans([]);
        return;
      }
      
      // Get unique clients
      const clientIds = [...new Set(data.workouts.map((plan: WorkoutPlan) => plan.clientId))];
      
      // Fetch client details
      const clientsResponse = await fetch('/api/trainers/clients');
      
      if (!clientsResponse.ok) {
        throw new Error("Failed to fetch clients");
      }
      
      const clientsData = await clientsResponse.json();
      const clients = clientsData.clients || [];
      
      // Organize plans by client
      const plansByClient = clientIds.map(clientId => {
        const client = clients.find((c: any) => c._id === clientId) || { _id: clientId, name: "Unknown Client" };
        const plans = data.workouts.filter((plan: WorkoutPlan) => plan.clientId === clientId);
        
        return {
          client,
          plans
        };
      });
      
      setClientPlans(plansByClient);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Error loading workout plans: ' + errorMessage);
      console.error("Error fetching workout plans:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleClient = (clientId: string) => {
    setExpandedClient(expandedClient === clientId ? null : clientId);
    setExpandedPlan(null); // Close any open plans when switching clients
  };

  const togglePlan = (planId: string) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-10">
      <div className="bg-[#151C2C] rounded-xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Client Workout Plans
        </h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : clientPlans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-2">No workout plans have been assigned to any clients yet.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4"
            >
              Create Client Plan
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {clientPlans.map(({ client, plans }) => (
              <div key={client._id} className="border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleClient(client._id)}
                  className={`w-full flex justify-between items-center p-4 text-left ${
                    expandedClient === client._id ? "bg-[#1F2A3E]" : "bg-[#1A2234]"
                  }`}
                >
                  <div>
                    <h3 className="text-white font-medium">{client.name}</h3>
                    <p className="text-sm text-gray-400">{plans.length} workout plan{plans.length !== 1 ? 's' : ''}</p>
                  </div>
                  {expandedClient === client._id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {expandedClient === client._id && (
                  <div className="p-4 space-y-3">
                    {plans.map((plan) => (
                      <div key={plan._id} className="bg-[#212B42] rounded-lg overflow-hidden">
                        <button
                          onClick={() => togglePlan(plan._id)}
                          className="w-full flex justify-between items-center p-3 text-left"
                        >
                          <div>
                            <h4 className="text-white">{plan.planName}</h4>
                            <p className="text-xs text-gray-400">
                              {formatDate(new Date(plan.startDate))} - {formatDate(new Date(plan.endDate))}
                            </p>
                          </div>
                          {expandedPlan === plan._id ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        
                        {expandedPlan === plan._id && (
                          <div className="p-3 border-t border-gray-700">
                            {plan.days.filter(day => day.exercises.length > 0).map((day) => (
                              <div key={day.day} className="mb-4">
                                <h5 className="text-blue-400 font-medium mb-2">{day.day}</h5>
                                <div className="space-y-2">
                                  {day.exercises.map((exercise, idx) => (
                                    <div key={idx} className="bg-[#1A2234] p-2 rounded">
                                      <div className="flex justify-between">
                                        <span className="text-white">{exercise.name}</span>
                                        <span className="text-gray-400 text-sm">
                                          {exercise.sets} × {exercise.reps} | {exercise.rest} rest
                                        </span>
                                      </div>
                                      {exercise.notes && (
                                        <p className="text-xs text-gray-400 mt-1">
                                          Note: {exercise.notes}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                            {plan.notes && (
                              <div className="mt-3 pt-3 border-t border-gray-700">
                                <p className="text-sm text-gray-300">
                                  <span className="text-gray-400">Additional Notes:</span> {plan.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
