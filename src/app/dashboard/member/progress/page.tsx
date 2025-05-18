"use client";

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Calendar, Activity, Scale, Ruler, ChevronDown, Save, Plus, ArrowUp, ArrowDown, Download } from 'lucide-react';

interface ProgressData {
  date: string;
  weight: number;
  bodyFat: number;
  muscle: number;
  measurements: {
    chest: number;
    waist: number;
    hips: number;
    biceps: number;
    thighs: number;
  };
}

interface Milestone {
  metric: string;
  target: number;
  current: number;
  unit: string;
  date: string;
}

interface FitnessGoal {
  primaryGoal: string;
  currentWeight: number;
  targetWeight: number;
  weeklyWorkoutTarget: number;
  preferredWorkoutTime: string;
  dietaryPreferences: string[];
}

export default function ProgressTracker() {
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [notification, setNotification] = useState<{show: boolean, message: string} | null>(null);
  const [newMeasurement, setNewMeasurement] = useState({
    date: new Date().toISOString().split('T')[0],
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    thighs: ''
  });
  // Updated to use 78 kg as the current weight across all data points for consistency
  const [progressData, setProgressData] = useState<ProgressData[]>([
    {
      date: '2025-01-15',
      weight: 85,
      bodyFat: 25,
      muscle: 32,
      measurements: { chest: 100, waist: 90, hips: 100, biceps: 35, thighs: 60 }
    },
    {
      date: '2025-02-15',
      weight: 83,
      bodyFat: 24,
      muscle: 33,
      measurements: { chest: 99, waist: 88, hips: 99, biceps: 36, thighs: 61 }
    },
    {
      date: '2025-03-15',
      weight: 81,
      bodyFat: 22,
      muscle: 34,
      measurements: { chest: 98, waist: 86, hips: 98, biceps: 37, thighs: 62 }
    },
    {
      date: '2025-04-15',
      weight: 79,
      bodyFat: 20,
      muscle: 35,
      measurements: { chest: 97, waist: 84, hips: 97, biceps: 38, thighs: 63 }
    },
    {
      date: '2025-05-15',
      weight: 78,
      bodyFat: 19,
      muscle: 36,
      measurements: { chest: 96, waist: 82, hips: 96, biceps: 39, thighs: 64 }
    }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoal | null>(null);
  const [isLoadingGoals, setIsLoadingGoals] = useState(false);

  // State for date filters
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  const validateMeasurements = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!newMeasurement.date) {
      newErrors.date = "Date is required";
    }
    
    // Optional validation for measurements - can be zero or positive
    if (newMeasurement.chest && parseFloat(newMeasurement.chest) < 0) {
      newErrors.chest = "Must be a positive number";
    }
    if (newMeasurement.waist && parseFloat(newMeasurement.waist) < 0) {
      newErrors.waist = "Must be a positive number";
    }
    if (newMeasurement.hips && parseFloat(newMeasurement.hips) < 0) {
      newErrors.hips = "Must be a positive number";
    }
    if (newMeasurement.biceps && parseFloat(newMeasurement.biceps) < 0) {
      newErrors.biceps = "Must be a positive number";
    }
    if (newMeasurement.thighs && parseFloat(newMeasurement.thighs) < 0) {
      newErrors.thighs = "Must be a positive number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to load body measurements from the API
  const loadBodyMeasurements = async () => {
    try {
      const response = await fetch('/api/members/body-measurements');
      
      if (!response.ok) {
        throw new Error('Failed to load measurements');
      }
      
      const data = await response.json();
      
      if (data.measurements && data.measurements.length > 0) {
        // Format the measurements to match our ProgressData structure
        const formattedData = data.measurements.map((item: any, index: number, array: any[]) => {
          // Calculate weight for historical data points based on fitness goals or trending data
          const startingWeight = fitnessGoals && typeof fitnessGoals.currentWeight === 'number' && !isNaN(fitnessGoals.currentWeight) && fitnessGoals.currentWeight > 0
            ? fitnessGoals.currentWeight + (array.length - 1 - index) * 1.5  // Add weight for historical entries
            : 85 - (index * 1.5);  // Fallback trending data if no fitness goals available
          
          // Check if the item already has weight data
          const weight = item.weight && !isNaN(Number(item.weight)) && Number(item.weight) > 0
            ? Number(item.weight)  // Use existing weight if available
            : startingWeight;      // Use calculated weight otherwise
          
          return {
            date: new Date(item.date).toISOString().split('T')[0],
            weight: weight,
            bodyFat: item.bodyFat ? Number(item.bodyFat) : (progressData.length > 0 ? progressData[0].bodyFat - (index * 1.2) : 25 - (index * 1.2)),
            muscle: item.muscle ? Number(item.muscle) : (progressData.length > 0 ? progressData[0].muscle + (index * 0.8) : 32 + (index * 0.8)),
            measurements: item.measurements
          };
        });
        
        setProgressData(formattedData);
      }
    } catch (error) {
      console.error('Failed to load body measurements:', error);
      // Keep using the default data
    }
  };
  
  // Function to load fitness goals from the API
  const loadFitnessGoals = async () => {
    setIsLoadingGoals(true);
    try {
      // Add cache busting parameter to avoid browser caching
      const response = await fetch(`/api/members/fitness-goals?t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load fitness goals: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Log the data to help with debugging
      console.log('Received fitness goals data from API:', data);
      
      if (data.fitnessGoals) {
        // The API returns the data wrapped in fitnessGoals property
        if (validateFitnessGoalsData(data.fitnessGoals)) {
          // Get the current weight from the latest progress data point or from the fitness goals
          const latestProgressWeight = progressData.length > 0 ? progressData[progressData.length - 1].weight : 0;
          
          // Ensure numeric properties are actually numbers
          const processedGoals = {
            ...data.fitnessGoals,
            currentWeight: typeof data.fitnessGoals.currentWeight === 'number' && !isNaN(data.fitnessGoals.currentWeight) 
              ? data.fitnessGoals.currentWeight 
              : latestProgressWeight > 0 ? latestProgressWeight : 0,
            targetWeight: typeof data.fitnessGoals.targetWeight === 'number' && !isNaN(data.fitnessGoals.targetWeight)
              ? data.fitnessGoals.targetWeight 
              : 0,
            weeklyWorkoutTarget: typeof data.fitnessGoals.weeklyWorkoutTarget === 'number' && !isNaN(data.fitnessGoals.weeklyWorkoutTarget)
              ? data.fitnessGoals.weeklyWorkoutTarget 
              : 3
          };
          
          setFitnessGoals(processedGoals);
          console.log('Successfully set fitness goals state:', processedGoals);
          
          // Update the progress data only if we have fitness goals with a valid weight that differs from progress data
          if (progressData.length > 0 && 
              typeof data.fitnessGoals.currentWeight === 'number' && 
              !isNaN(data.fitnessGoals.currentWeight) &&
              data.fitnessGoals.currentWeight > 0 &&
              data.fitnessGoals.currentWeight !== progressData[progressData.length - 1].weight) {
            const updatedProgressData = [...progressData];
            updatedProgressData[updatedProgressData.length - 1] = {
              ...updatedProgressData[updatedProgressData.length - 1],
              weight: data.fitnessGoals.currentWeight
            };
            setProgressData(updatedProgressData);
          }
        } else {
          console.warn('Fitness goals data from API does not have the expected structure:', data.fitnessGoals);
          throw new Error('Invalid fitness goals data structure');
        }
      } else {
        console.warn('No fitnessGoals property found in API response');
        throw new Error('Missing fitnessGoals in API response');
      }
    } catch (error) {
      console.error('Failed to load fitness goals:', error);
      
      // Set a default state for fitness goals if the API fails
      // Use the latest progress data weight if available
      const latestWeight = progressData.length > 0 && 
                          typeof progressData[progressData.length - 1].weight === 'number' && 
                          !isNaN(progressData[progressData.length - 1].weight) && 
                          progressData[progressData.length - 1].weight > 0 
                            ? progressData[progressData.length - 1].weight 
                            : 0;
                            
      const defaultGoals = {
        primaryGoal: 'General Fitness',
        currentWeight: latestWeight,
        targetWeight: 0,
        weeklyWorkoutTarget: 3,
        preferredWorkoutTime: 'Evening',
        dietaryPreferences: []
      };
      
      console.log('Setting default fitness goals:', defaultGoals);
      setFitnessGoals(defaultGoals);
    } finally {
      setIsLoadingGoals(false);
    }
  };

  // Function to check if fitness goals data has the expected structure
  const validateFitnessGoalsData = (data: any): boolean => {
    if (!data) return false;
    
    // Check for required properties
    const hasRequiredProps = 
      'primaryGoal' in data && 
      'currentWeight' in data && 
      'targetWeight' in data && 
      'weeklyWorkoutTarget' in data;
    
    // Check if numeric fields are actually numeric or can be converted to numbers
    const currentWeightValid = 
      data.currentWeight !== null && 
      data.currentWeight !== undefined && 
      !isNaN(Number(data.currentWeight));
      
    const targetWeightValid = 
      data.targetWeight !== null && 
      data.targetWeight !== undefined && 
      !isNaN(Number(data.targetWeight));
      
    const weeklyWorkoutTargetValid = 
      data.weeklyWorkoutTarget !== null && 
      data.weeklyWorkoutTarget !== undefined && 
      !isNaN(Number(data.weeklyWorkoutTarget));
    
    console.log('Fitness goals validation:', { 
      hasRequiredProps,
      primaryGoal: data.primaryGoal,
      currentWeight: data.currentWeight,
      currentWeightValid,
      targetWeight: data.targetWeight,
      targetWeightValid,
      weeklyWorkoutTarget: data.weeklyWorkoutTarget,
      weeklyWorkoutTargetValid
    });
    
    // Return true even if numeric fields aren't valid as we'll handle that during processing
    return hasRequiredProps;
  };

  // Synchronize weight data between fitness goals and progress data
  const syncWeightData = () => {
    // If both fitness goals and progress data exist, ensure they're in sync
    if (fitnessGoals && progressData.length > 0) {
      const currentProgressWeight = progressData[progressData.length - 1].weight;
      const fitnessGoalsWeight = fitnessGoals.currentWeight;
      
      // Only update if both values exist and don't match
      if (typeof fitnessGoalsWeight === 'number' && !isNaN(fitnessGoalsWeight) && 
          typeof currentProgressWeight === 'number' && !isNaN(currentProgressWeight) &&
          fitnessGoalsWeight !== currentProgressWeight) {
        
        // Prioritize fitness goals weight as the source of truth for current weight
        if (fitnessGoalsWeight > 0) {
          const updatedProgressData = [...progressData];
          updatedProgressData[updatedProgressData.length - 1] = {
            ...updatedProgressData[updatedProgressData.length - 1],
            weight: fitnessGoalsWeight
          };
          setProgressData(updatedProgressData);
        }
        // If no valid weight in fitness goals but valid in progress, update fitness goals
        else if (currentProgressWeight > 0) {
          setFitnessGoals({
            ...fitnessGoals,
            currentWeight: currentProgressWeight
          });
        }
      }
    }
  };

  // Load measurements and fitness goals on component mount
  useEffect(() => {
    // Set up data loading functions
    const loadData = async () => {
      try {
        await Promise.all([
          loadBodyMeasurements(),
          loadFitnessGoals()
        ]);
        
        // Synchronize weight data across app
        syncWeightData();
        
        console.log('Initial data loading complete');
      } catch (error) {
        console.error('Error during initial data loading:', error);
      }
    };
    
    loadData();
    
    // Set up data refresh on visibility change (when user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab became visible, refreshing data...');
        loadFitnessGoals();
        
        // Re-sync weight data after refresh
        setTimeout(syncWeightData, 500);
      }
    };
    
    // Add event listener for debugging
    const handleDebugKey = (e: KeyboardEvent) => {
      // Press Ctrl+Alt+F to force reload fitness goals data
      if (e.ctrlKey && e.altKey && e.key === 'f') {
        console.log('Manually reloading fitness goals data...');
        loadFitnessGoals();
      }
      // Press Ctrl+Alt+M to force reload measurement data
      if (e.ctrlKey && e.altKey && e.key === 'm') {
        console.log('Manually reloading measurements data...');
        loadBodyMeasurements();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleDebugKey);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleDebugKey);
    };
  }, []);

  const handleSaveMeasurement = async () => {
    if (!validateMeasurements()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert string values to numbers
      const numericMeasurement = {
        chest: parseFloat(newMeasurement.chest) || 0,
        waist: parseFloat(newMeasurement.waist) || 0,
        hips: parseFloat(newMeasurement.hips) || 0,
        biceps: parseFloat(newMeasurement.biceps) || 0,
        thighs: parseFloat(newMeasurement.thighs) || 0
      };
      
      // Save the measurement to the API
      const response = await fetch('/api/members/body-measurements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          measurement: {
            ...newMeasurement,
            chest: numericMeasurement.chest,
            waist: numericMeasurement.waist,
            hips: numericMeasurement.hips,
            biceps: numericMeasurement.biceps,
            thighs: numericMeasurement.thighs
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save measurement');
      }
      
      // Refresh data from the API
      await loadBodyMeasurements();
      
      // Reset form and close modal
      setNewMeasurement({
        date: new Date().toISOString().split('T')[0],
        chest: '',
        waist: '',
        hips: '',
        biceps: '',
        thighs: ''
      });
      setShowMeasurementForm(false);
      
      // Show notification
      setNotification({
        show: true,
        message: 'Your body measurements have been saved successfully!'
      });
      
      // Auto-expand the measurements section
      setShowMeasurements(true);
      
      // Refresh fitness goals data as well for up-to-date progress calculations
      loadFitnessGoals();
    } catch (error) {
      console.error("Error saving measurements:", error);
      setNotification({
        show: true,
        message: 'Failed to save measurements. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  // Hide notification after 3 seconds
  useEffect(() => {
    if (notification?.show) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  // Generate milestones based on fitness goals and latest measurements
  const milestones: Milestone[] = React.useMemo(() => {
    console.log('Calculating milestones with fitness goals:', fitnessGoals);
    
    if (!fitnessGoals) {
      return [
        { metric: 'Weight', target: 75, current: 78, unit: 'kg', date: '2025-07-15' },
        { metric: 'Body Fat', target: 15, current: 19, unit: '%', date: '2025-07-15' },
        { metric: 'Muscle Mass', target: 40, current: 36, unit: '%', date: '2025-07-15' }
      ];
    }
    
    // Set end date to 3 months from now as a default if none is specified
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 3);
    
    // Determine current weight from either progress data or fitness goals, with proper safety checks
    const currentWeight = (() => {
      // First try to get it from the latest progress data
      if (progressData.length > 0 && progressData[progressData.length - 1]?.weight !== undefined && 
          !isNaN(progressData[progressData.length - 1].weight) && 
          progressData[progressData.length - 1].weight > 0) {
        return progressData[progressData.length - 1].weight;
      }
      
      // If not available in progress data, try to get from fitness goals
      if (typeof fitnessGoals.currentWeight === 'number' && 
          !isNaN(fitnessGoals.currentWeight) && 
          fitnessGoals.currentWeight > 0) {
        return fitnessGoals.currentWeight;
      }
      
      // Fallback default
      return 75;
    })();
    
    const currentBodyFat = (() => {
      if (progressData.length > 0 && progressData[progressData.length - 1]?.bodyFat !== undefined && 
          !isNaN(progressData[progressData.length - 1].bodyFat) && 
          progressData[progressData.length - 1].bodyFat > 0) {
        return progressData[progressData.length - 1].bodyFat;
      }
      return 20; // Default value if no data is available
    })();
    
    const currentMuscle = (() => {
      if (progressData.length > 0 && progressData[progressData.length - 1]?.muscle !== undefined && 
          !isNaN(progressData[progressData.length - 1].muscle) && 
          progressData[progressData.length - 1].muscle > 0) {
        return progressData[progressData.length - 1].muscle;
      }
      return 35; // Default value if no data is available
    })();
    
    // Get target weight with strong validation and fallbacks
    const targetWeight = (() => {
      // First try to get it from fitness goals
      if (typeof fitnessGoals.targetWeight === 'number' && 
          !isNaN(fitnessGoals.targetWeight) && 
          fitnessGoals.targetWeight > 0) {
        return fitnessGoals.targetWeight;
      }
      
      // If no valid target weight in fitness goals, calculate based on current weight
      if (currentWeight > 0) {
        // If primary goal is weight loss, target 5kg less than current
        // If primary goal is muscle gain, target slight increase
        // Otherwise, small reduction as default goal
        if (fitnessGoals.primaryGoal === 'Weight Loss') {
          return Math.max(currentWeight - 5, 50); // Ensure target isn't unrealistically low
        } else if (fitnessGoals.primaryGoal === 'Muscle Gain') {
          return currentWeight + 3;
        } else {
          return currentWeight - 2;
        }
      }
      
      // Ultimate fallback if no data is available
      return 70;
    })();
    
    // Get weekly workout target with validation
    const weeklyWorkoutTarget = (() => {
      if (typeof fitnessGoals.weeklyWorkoutTarget === 'number' && 
          !isNaN(fitnessGoals.weeklyWorkoutTarget) && 
          fitnessGoals.weeklyWorkoutTarget > 0) {
        return fitnessGoals.weeklyWorkoutTarget;
      }
      return 3; // Default 3 workouts per week
    })();
    
    // Get primary goal with fallback
    const primaryGoal = fitnessGoals.primaryGoal || 'General Fitness';
    
    console.log('Current values:', { 
      currentWeight, 
      currentBodyFat, 
      currentMuscle, 
      targetWeight, 
      weeklyWorkoutTarget, 
      primaryGoal 
    });
    
    const result = [
      { 
        metric: 'Weight', 
        target: targetWeight, 
        current: currentWeight, 
        unit: 'kg', 
        date: targetDate.toISOString().split('T')[0] 
      },
      { 
        metric: 'Body Fat', 
        target: primaryGoal === 'Weight Loss' ? Math.max(currentBodyFat - 5, 10) : currentBodyFat - 2, 
        current: currentBodyFat, 
        unit: '%', 
        date: targetDate.toISOString().split('T')[0] 
      },
      { 
        metric: 'Muscle Mass', 
        target: primaryGoal === 'Muscle Gain' ? currentMuscle + 5 : currentMuscle + 2, 
        current: currentMuscle, 
        unit: '%', 
        date: targetDate.toISOString().split('T')[0] 
      },
      { 
        metric: 'Weekly Workouts', 
        target: weeklyWorkoutTarget, 
        current: Math.floor(weeklyWorkoutTarget * 0.7), // Placeholder for actual tracking data
        unit: '', 
        date: targetDate.toISOString().split('T')[0] 
      }
    ];
    
    console.log('Generated milestones:', result);
    return result;
  }, [fitnessGoals, progressData]);

  // Create a safe default for progress data to prevent errors when data is loading
  const defaultProgressValues = {
    weight: 0,
    bodyFat: 0,
    muscle: 0,
    measurements: {
      chest: 0,
      waist: 0,
      hips: 0,
      biceps: 0,
      thighs: 0
    }
  };

  // Safe access to progress data with additional null checks
  const latestProgress = {
    weight: {
      current: progressData.length > 0 && progressData[progressData.length - 1]?.weight !== undefined 
        ? progressData[progressData.length - 1].weight 
        : defaultProgressValues.weight,
      previous: progressData.length > 1 && progressData[progressData.length - 2]?.weight !== undefined 
        ? progressData[progressData.length - 2].weight 
        : defaultProgressValues.weight
    },
    bodyFat: {
      current: progressData.length > 0 && progressData[progressData.length - 1]?.bodyFat !== undefined 
        ? progressData[progressData.length - 1].bodyFat 
        : defaultProgressValues.bodyFat,
      previous: progressData.length > 1 && progressData[progressData.length - 2]?.bodyFat !== undefined 
        ? progressData[progressData.length - 2].bodyFat 
        : defaultProgressValues.bodyFat
    },
    muscle: {
      current: progressData.length > 0 && progressData[progressData.length - 1]?.muscle !== undefined 
        ? progressData[progressData.length - 1].muscle 
        : defaultProgressValues.muscle,
      previous: progressData.length > 1 && progressData[progressData.length - 2]?.muscle !== undefined 
        ? progressData[progressData.length - 2].muscle 
        : defaultProgressValues.muscle
    }
  };

  // Function to export measurements as CSV
  const exportMeasurementsAsCSV = () => {
    // Define CSV headers
    let csvContent = "Date,Chest (cm),Waist (cm),Hips (cm),Biceps (cm),Thighs (cm)\n";
    
    // Add each row of data
    [...filteredProgressData].reverse().forEach(data => {
      if (!data || !data.date || !data.measurements) return;

      const date = new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const row = [
        date,
        data.measurements?.chest || 0,
        data.measurements?.waist || 0,
        data.measurements?.hips || 0,
        data.measurements?.biceps || 0,
        data.measurements?.thighs || 0
      ].join(',');
      csvContent += row + "\n";
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `body-measurements-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show notification
    setNotification({
      show: true,
      message: 'Your measurements have been downloaded as CSV'
    });
  };

  // Function to calculate progress percentage
  const calculateProgress = (current: number, initial: number, isPositiveGood: boolean = false) => {
    if (initial === 0) return 0;
    const change = ((current - initial) / initial) * 100;
    return isPositiveGood ? change : -change; // Invert for metrics where decrease is progress
  };

  // Component for rendering a progress comparison card
  const ProgressComparisonCard = ({ 
    label, 
    initial, 
    current, 
    unit = 'cm', 
    isPositiveGood = false 
  }: { 
    label: string; 
    initial: number; 
    current: number; 
    unit?: string; 
    isPositiveGood?: boolean 
  }) => {
    const progress = calculateProgress(current, initial, isPositiveGood);
    const isPositive = progress > 0;
    const absProgress = Math.abs(progress);
    
    return (
      <div className="bg-[#1A2234] p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="text-gray-400 capitalize">{label}</div>
          <div className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : '-'}{absProgress.toFixed(1)}%
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-500">Initial:</span> <span className="text-white">{initial} {unit}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Current:</span> <span className="text-white">{current} {unit}</span>
          </div>
        </div>
        <div className="mt-2 relative bg-[#151C2C] h-2 rounded-full">
          <div 
            className={`absolute left-0 top-0 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(absProgress, 100)}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Filtered measurements based on date range
  const filteredProgressData = React.useMemo(() => {
    // Return empty array if progressData is undefined or empty
    if (!progressData || progressData.length === 0) {
      return [];
    }

    if (!dateFilter.startDate && !dateFilter.endDate) {
      return progressData;
    }
    
    return progressData.filter(data => {
      if (!data || !data.date) return false;
      
      const dataDate = new Date(data.date).getTime();
      const start = dateFilter.startDate ? new Date(dateFilter.startDate).getTime() : 0;
      const end = dateFilter.endDate ? new Date(dateFilter.endDate).getTime() : Infinity;
      
      return dataDate >= start && dataDate <= end;
    });
  }, [progressData, dateFilter]);

  return (
    <div className="p-8">
      {/* Notification */}
      {notification && notification.show && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center z-50 animate-fade-in-out">
          <div className="mr-2">✓</div>
          <div>{notification.message}</div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">Progress Tracker</h1>
          <p className="text-gray-400">Track your fitness journey progress</p>
        </div>
        <button
          onClick={() => setShowMeasurementForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Body Measurement
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-[#151C2C] p-4 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-gray-400 text-sm mb-1">Start Date</label>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})}
              className="w-full p-2 bg-[#1A2234] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-400 text-sm mb-1">End Date</label>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})}
              className="w-full p-2 bg-[#1A2234] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Current Weight</div>
            <Scale className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-semibold text-white">
            {(() => {
              // First try to get weight from progress data
              if (progressData.length > 0 && typeof progressData[progressData.length - 1].weight === 'number' && 
                  !isNaN(progressData[progressData.length - 1].weight) && progressData[progressData.length - 1].weight > 0) {
                return progressData[progressData.length - 1].weight;
              }
              
              // If not available, try fitness goals data
              if (fitnessGoals && typeof fitnessGoals.currentWeight === 'number' && 
                  !isNaN(fitnessGoals.currentWeight) && fitnessGoals.currentWeight > 0) {
                return fitnessGoals.currentWeight;
              }
              
              // Fallback to latestProgress (which may be 0)
              return latestProgress.weight.current;
            })().toFixed(1)} kg
          </div>
          {progressData.length > 1 ? (
            <div className={`text-sm flex items-center gap-1 mt-2 
              ${latestProgress.weight.current < latestProgress.weight.previous ? 'text-green-500' : 'text-red-500'}`}
            >
              {latestProgress.weight.current < latestProgress.weight.previous ? (
                <ArrowDown className="w-4 h-4" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
              {Math.abs(latestProgress.weight.current - latestProgress.weight.previous).toFixed(1)} kg
            </div>
          ) : (
            <div className="text-sm text-gray-400 mt-2">No previous data</div>
          )}
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Body Fat %</div>
            <Activity className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl font-semibold text-white">{latestProgress.bodyFat.current}%</div>
          {progressData.length > 1 ? (
            <div className={`text-sm flex items-center gap-1 mt-2 
              ${latestProgress.bodyFat.current < latestProgress.bodyFat.previous ? 'text-green-500' : 'text-red-500'}`}
            >
              {latestProgress.bodyFat.current < latestProgress.bodyFat.previous ? (
                <ArrowDown className="w-4 h-4" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
              {Math.abs(latestProgress.bodyFat.current - latestProgress.bodyFat.previous).toFixed(1)}%
            </div>
          ) : (
            <div className="text-sm text-gray-400 mt-2">No previous data</div>
          )}
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Muscle Mass</div>
            <Activity className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-semibold text-white">{latestProgress.muscle.current}%</div>
          {progressData.length > 1 ? (
            <div className={`text-sm flex items-center gap-1 mt-2 
              ${latestProgress.muscle.current > latestProgress.muscle.previous ? 'text-green-500' : 'text-red-500'}`}
            >
              {latestProgress.muscle.current > latestProgress.muscle.previous ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              {Math.abs(latestProgress.muscle.current - latestProgress.muscle.previous).toFixed(1)}%
            </div>
          ) : (
            <div className="text-sm text-gray-400 mt-2">No previous data</div>
          )}
        </div>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-lg font-medium text-white">Progress Overview</h2>
              {fitnessGoals && (
                <p className="text-sm text-gray-400 mt-1">
                  Based on your goal: {fitnessGoals.primaryGoal || 'General Fitness'}
                  {(fitnessGoals.targetWeight && !isNaN(Number(fitnessGoals.targetWeight)) && Number(fitnessGoals.targetWeight) > 0) && (
                    <span> • Target Weight: {Number(fitnessGoals.targetWeight).toFixed(1)} kg</span>
                  )}
                  {(fitnessGoals.weeklyWorkoutTarget && !isNaN(Number(fitnessGoals.weeklyWorkoutTarget)) && Number(fitnessGoals.weeklyWorkoutTarget) > 0) && (
                    <span> • {Number(fitnessGoals.weeklyWorkoutTarget)} workouts/week</span>
                  )}
                </p>
              )}
            </div>
            <div className="flex gap-2 mt-3 md:mt-0">
              {['1M', '3M', '6M', '1Y'].map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    selectedTimeframe === timeframe
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#1A2234] text-gray-400 hover:text-white'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2234" />
                <XAxis
                  dataKey="date"
                  stroke="#4B5563"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#4B5563" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A2234', border: 'none' }}
                  labelStyle={{ color: '#9CA3AF' }}
                  formatter={(value: number) => [`${value}`, '']}
                />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2} name="Weight (kg)" />
                <Line type="monotone" dataKey="bodyFat" stroke="#EF4444" strokeWidth={2} name="Body Fat %" />
                <Line type="monotone" dataKey="muscle" stroke="#10B981" strokeWidth={2} name="Muscle Mass %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Milestones & Fitness Goals */}
      <div className="bg-[#151C2C] p-6 rounded-xl mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-white">Goal Progress</h2>
          {fitnessGoals && fitnessGoals.primaryGoal && (
            <div className="text-sm text-blue-500">
              Primary Goal: {fitnessGoals.primaryGoal}
            </div>
          )}
        </div>
        
        {isLoadingGoals ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : fitnessGoals ? (
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="bg-[#1A2234] p-4 rounded-lg">
                <div className="flex flex-wrap justify-between items-center mb-2">
                  <div className="text-white">{milestone.metric}</div>
                  <div className="text-gray-400">
                    Target: {milestone.target || 0}{milestone.unit} by {new Date(milestone.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div className="text-xs text-gray-400">
                      Current: {milestone.current || 0}{milestone.unit}
                    </div>
                    <div className="text-xs text-gray-400">
                      {milestone.target !== 0 ? 
                        (() => {
                          // For weight metric where we might want to lose weight
                          if (milestone.metric === 'Weight' && fitnessGoals?.primaryGoal === 'Weight Loss') {
                            const progressPercent = milestone.current <= milestone.target ? 100 : 
                              Math.max(0, 100 - ((milestone.current - milestone.target) / milestone.target * 100));
                            return `${Math.min(Math.round(progressPercent), 100)}%`;
                          }
                          
                          // Default calculation for other metrics
                          return `${Math.min(Math.round(((milestone.current || 0) / (milestone.target || 1)) * 100), 100)}%`;
                        })() : 
                        'No target set'}
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-[#151C2C]">
                    {milestone.target !== 0 && (
                      <div
                        style={{ 
                          width: (() => {
                            // Special handling for Weight metric with different goals
                            if (milestone.metric === 'Weight') {
                              if (fitnessGoals?.primaryGoal === 'Weight Loss') {
                                // For weight loss: show progress toward reaching target weight
                                // 100% when current <= target, decreasing as current exceeds target
                                if (milestone.current <= milestone.target) {
                                  return '100%';
                                } else {
                                  // Ensure we have a reasonable progress bar rather than something too small
                                  const progressPercent = Math.max(0, 100 - ((milestone.current - milestone.target) / milestone.target * 100));
                                  return `${Math.min(progressPercent, 100)}%`;
                                }
                              } else if (fitnessGoals?.primaryGoal === 'Muscle Gain') {
                                // For muscle gain: show progress toward increasing to target weight
                                if (milestone.current >= milestone.target) {
                                  return '100%';
                                } else {
                                  return `${Math.min(((milestone.current || 0) / (milestone.target || 1)) * 100, 100)}%`;
                                }
                              }
                            }

                            // Default calculation for other metrics
                            return `${Math.min(((milestone.current || 0) / (milestone.target || 1)) * 100, 100)}%`;
                          })()
                        }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          milestone.metric === 'Weight' ? 
                            (fitnessGoals?.primaryGoal === 'Weight Loss' ? 
                              (milestone.current > milestone.target ? 'bg-red-600' : 'bg-green-600') : 
                              (milestone.current < milestone.target ? 'bg-red-600' : 'bg-green-600')
                            ) : 
                            'bg-blue-600'
                        }`}
                      />
                    )}
                  </div>
                </div>
                
                {/* Show relevant hints based on the goal */}
                {milestone.metric === 'Weekly Workouts' && fitnessGoals.preferredWorkoutTime && (
                  <div className="text-xs text-gray-400 mt-2">
                    <span className="text-blue-500">Tip:</span> Try to workout {(fitnessGoals.preferredWorkoutTime || '').toLowerCase()} for best results
                  </div>
                )}
                
                {milestone.metric === 'Weight' && (
                  <div className="text-xs text-gray-400 mt-2">
                    <span className="text-blue-500">Goal:</span> {milestone.current > milestone.target ? 'Lose' : 'Gain'} {Math.abs(milestone.current - milestone.target).toFixed(1)} kg
                  </div>
                )}
              </div>
            ))}
            
            {/* Dietary Preferences */}
            {fitnessGoals?.dietaryPreferences && Array.isArray(fitnessGoals.dietaryPreferences) && fitnessGoals.dietaryPreferences.filter(Boolean).length > 0 && (
              <div className="bg-[#1A2234] p-4 rounded-lg">
                <div className="text-white mb-2">Dietary Preferences</div>
                <div className="flex flex-wrap gap-2">
                  {fitnessGoals.dietaryPreferences
                    .filter(pref => pref && pref.trim() !== '') // Filter out empty strings
                    .map((pref, index) => (
                      <span key={index} className="px-2 py-1 bg-[#151C2C] text-gray-300 rounded text-xs">
                        {pref}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#1A2234] p-4 rounded-lg">
            <div className="text-gray-400 text-center py-4">
              No fitness goals found. Please set your fitness goals to track progress.
            </div>
          </div>
        )}
      </div>

      {/* Fitness Goals Update Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => window.location.href = '/dashboard/member/goals'}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A2234] text-blue-500 rounded-lg hover:bg-[#212b44] transition-colors"
        >
          <span className="text-sm">Update Fitness Goals</span>
        </button>
      </div>

      {/* Body Measurements */}
      <div className="bg-[#151C2C] p-6 rounded-xl">
        <button
          onClick={() => setShowMeasurements(!showMeasurements)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-medium text-white">Body Measurements</h2>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform 
            ${showMeasurements ? 'rotate-180' : ''}`}
          />
        </button>

        {showMeasurements && (
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-80">            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2234" />
                <XAxis
                  dataKey="date"
                  stroke="#4B5563"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-GB', { month: 'short' })}
                />
                <YAxis stroke="#4B5563" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A2234', border: 'none' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Bar dataKey="measurements.chest" name="Chest" fill="#3B82F6" />
                <Bar dataKey="measurements.waist" name="Waist" fill="#EF4444" />
                <Bar dataKey="measurements.hips" name="Hips" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                {filteredProgressData.length > 0 && filteredProgressData[filteredProgressData.length - 1]?.measurements && 
                 Object.entries(filteredProgressData[filteredProgressData.length - 1].measurements || {}).map(([key, value]) => {
                  const previousValue = filteredProgressData.length > 1 && filteredProgressData[filteredProgressData.length - 2]?.measurements
                    ? filteredProgressData[filteredProgressData.length - 2].measurements[key as keyof typeof progressData[0]['measurements']] 
                    : value;
                  const change = (value || 0) - (previousValue || 0);
                  
                  return (
                    <div key={key} className="bg-[#1A2234] p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="text-gray-400 capitalize">{key}</div>
                        <div className="text-white">{value} cm</div>
                      </div>
                      <div className={`text-sm mt-1 ${
                        key === 'biceps' || key === 'thighs' 
                          ? (change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-blue-500')
                          : (change < 0 ? 'text-green-500' : change > 0 ? 'text-red-500' : 'text-blue-500')
                      }`}>
                        {change.toFixed(1)} cm change
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Progress Comparison Section */}
            {filteredProgressData.length >= 2 && filteredProgressData[0]?.measurements && filteredProgressData[filteredProgressData.length - 1]?.measurements && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-white mb-4">Overall Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(filteredProgressData[0].measurements || defaultProgressValues.measurements).map(([key, initialValue]) => {
                    const currentValue = filteredProgressData[filteredProgressData.length - 1]?.measurements?.[key as keyof typeof progressData[0]['measurements']] || initialValue;
                    const isPositiveGood = key === 'biceps' || key === 'thighs'; // For these, increase is good
                    
                    return (
                      <ProgressComparisonCard 
                        key={key}
                        label={key}
                        initial={initialValue}
                        current={currentValue}
                        isPositiveGood={isPositiveGood}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Measurements History Table */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Measurement History</h3>
                <button 
                  onClick={exportMeasurementsAsCSV}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#1A2234] text-blue-500 rounded-lg hover:bg-[#212b44] transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
              
              {/* Date Range Filter */}
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={dateFilter.startDate}
                    onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})}
                    className="w-full p-2 bg-[#1A2234] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">End Date</label>
                  <input 
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})}
                    className="w-full p-2 bg-[#1A2234] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Filter reset button if filters are set */}
              {(dateFilter.startDate || dateFilter.endDate) && (
                <div className="flex justify-end mb-3">
                  <button
                    onClick={() => setDateFilter({startDate: '', endDate: ''})}
                    className="text-blue-500 text-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
              
              {/* Show count of displayed records */}
              <div className="text-sm text-gray-400 mb-2">
                Showing {filteredProgressData.length} of {progressData.length} measurements
              </div>
              
              {/* Empty state when no measurements match the filter */}
              {filteredProgressData.length === 0 && (
                <div className="bg-[#1A2234] p-6 rounded-lg text-center">
                  <div className="text-gray-400 mb-2">No measurements found</div>
                  {(dateFilter.startDate || dateFilter.endDate) ? (
                    <div className="text-sm text-gray-500">
                      Try adjusting your date filters or <button 
                        onClick={() => setDateFilter({startDate: '', endDate: ''})}
                        className="text-blue-500 hover:underline"
                      >
                        clear all filters
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Start by adding your first body measurement
                    </div>
                  )}
                </div>
              )}
              
              {filteredProgressData.length > 0 && (
                <>
                  {/* Desktop View - Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-400 uppercase bg-[#1A2234]">
                        <tr>
                          <th scope="col" className="px-6 py-3">Date</th>
                          <th scope="col" className="px-6 py-3">Chest (cm)</th>
                          <th scope="col" className="px-6 py-3">Waist (cm)</th>
                          <th scope="col" className="px-6 py-3">Hips (cm)</th>
                          <th scope="col" className="px-6 py-3">Biceps (cm)</th>
                          <th scope="col" className="px-6 py-3">Thighs (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProgressData.length > 0 && [...filteredProgressData].reverse().map((data, index) => {
                          const prevData = index < filteredProgressData.length - 1 ? [...filteredProgressData].reverse()[index + 1] : null;
                          return data && (
                            <tr key={index} className="border-b border-gray-700 bg-[#1A2234] hover:bg-[#212b44]">
                              <td className="px-6 py-4 whitespace-nowrap">
                                {data.date ? new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                              </td>
                              <td className="px-6 py-4">
                                {data.measurements?.chest || 0}
                                {prevData && prevData.measurements && (
                                  <span className={`ml-2 ${(data.measurements?.chest || 0) < (prevData.measurements?.chest || 0) ? 'text-green-500' : (data.measurements?.chest || 0) > (prevData.measurements?.chest || 0) ? 'text-red-500' : 'text-gray-500'}`}>
                                    {(data.measurements?.chest || 0) < (prevData.measurements?.chest || 0) ? '↓' : (data.measurements?.chest || 0) > (prevData.measurements?.chest || 0) ? '↑' : '→'}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {data.measurements?.waist || 0}
                                {prevData && prevData.measurements && (
                                  <span className={`ml-2 ${(data.measurements?.waist || 0) < (prevData.measurements?.waist || 0) ? 'text-green-500' : (data.measurements?.waist || 0) > (prevData.measurements?.waist || 0) ? 'text-red-500' : 'text-gray-500'}`}>
                                    {(data.measurements?.waist || 0) < (prevData.measurements?.waist || 0) ? '↓' : (data.measurements?.waist || 0) > (prevData.measurements?.waist || 0) ? '↑' : '→'}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {data.measurements?.hips || 0}
                                {prevData && prevData.measurements && (
                                  <span className={`ml-2 ${(data.measurements?.hips || 0) < (prevData.measurements?.hips || 0) ? 'text-green-500' : (data.measurements?.hips || 0) > (prevData.measurements?.hips || 0) ? 'text-red-500' : 'text-gray-500'}`}>
                                    {(data.measurements?.hips || 0) < (prevData.measurements?.hips || 0) ? '↓' : (data.measurements?.hips || 0) > (prevData.measurements?.hips || 0) ? '↑' : '→'}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {data.measurements?.biceps || 0}
                                {prevData && prevData.measurements && (
                                  <span className={`ml-2 ${(data.measurements?.biceps || 0) > (prevData.measurements?.biceps || 0) ? 'text-green-500' : (data.measurements?.biceps || 0) < (prevData.measurements?.biceps || 0) ? 'text-red-500' : 'text-gray-500'}`}>
                                    {(data.measurements?.biceps || 0) > (prevData.measurements?.biceps || 0) ? '↑' : (data.measurements?.biceps || 0) < (prevData.measurements?.biceps || 0) ? '↓' : '→'}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {data.measurements?.thighs || 0}
                                {prevData && prevData.measurements && (
                                  <span className={`ml-2 ${(data.measurements?.thighs || 0) > (prevData.measurements?.thighs || 0) ? 'text-green-500' : (data.measurements?.thighs || 0) < (prevData.measurements?.thighs || 0) ? 'text-red-500' : 'text-gray-500'}`}>
                                    {(data.measurements?.thighs || 0) > (prevData.measurements?.thighs || 0) ? '↑' : (data.measurements?.thighs || 0) < (prevData.measurements?.thighs || 0) ? '↓' : '→'}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
              
                  {/* Mobile View - Cards */}
                  <div className="md:hidden space-y-4">
                    {filteredProgressData.length > 0 && [...filteredProgressData].reverse().map((data, index) => {
                      const prevData = index < filteredProgressData.length - 1 ? [...filteredProgressData].reverse()[index + 1] : null;
                      return data && (
                        <div key={index} className="bg-[#1A2234] p-4 rounded-lg">
                          <div className="font-medium text-white mb-2">
                            {data.date ? new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm">
                              <span className="text-gray-400">Chest:</span> {data.measurements?.chest || 0} cm
                              {prevData && (
                                <span className={`ml-1 ${data.measurements.chest < prevData.measurements.chest ? 'text-green-500' : data.measurements.chest > prevData.measurements.chest ? 'text-red-500' : 'text-gray-500'}`}>
                                  {data.measurements.chest < prevData.measurements.chest ? '↓' : data.measurements.chest > prevData.measurements.chest ? '↑' : '→'}
                                </span>
                              )}
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-400">Waist:</span> {data.measurements?.waist || 0} cm
                              {prevData && prevData.measurements && (
                                <span className={`ml-1 ${(data.measurements?.waist || 0) < (prevData.measurements?.waist || 0) ? 'text-green-500' : (data.measurements?.waist || 0) > (prevData.measurements?.waist || 0) ? 'text-red-500' : 'text-gray-500'}`}>
                                  {(data.measurements?.waist || 0) < (prevData.measurements?.waist || 0) ? '↓' : (data.measurements?.waist || 0) > (prevData.measurements?.waist || 0) ? '↑' : '→'}
                                </span>
                              )}
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-400">Hips:</span> {data.measurements?.hips || 0} cm
                              {prevData && prevData.measurements && (
                                <span className={`ml-1 ${(data.measurements?.hips || 0) < (prevData.measurements?.hips || 0) ? 'text-green-500' : (data.measurements?.hips || 0) > (prevData.measurements?.hips || 0) ? 'text-red-500' : 'text-gray-500'}`}>
                                  {(data.measurements?.hips || 0) < (prevData.measurements?.hips || 0) ? '↓' : (data.measurements?.hips || 0) > (prevData.measurements?.hips || 0) ? '↑' : '→'}
                                </span>
                              )}
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-400">Biceps:</span> {data.measurements?.biceps || 0} cm
                              {prevData && prevData.measurements && (
                                <span className={`ml-1 ${(data.measurements?.biceps || 0) > (prevData.measurements?.biceps || 0) ? 'text-green-500' : (data.measurements?.biceps || 0) < (prevData.measurements?.biceps || 0) ? 'text-red-500' : 'text-gray-500'}`}>
                                  {(data.measurements?.biceps || 0) > (prevData.measurements?.biceps || 0) ? '↑' : (data.measurements?.biceps || 0) < (prevData.measurements?.biceps || 0) ? '↓' : '→'}
                                </span>
                              )}
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-400">Thighs:</span> {data.measurements?.thighs || 0} cm
                              {prevData && prevData.measurements && (
                                <span className={`ml-1 ${(data.measurements?.thighs || 0) > (prevData.measurements?.thighs || 0) ? 'text-green-500' : (data.measurements?.thighs || 0) < (prevData.measurements?.thighs || 0) ? 'text-red-500' : 'text-gray-500'}`}>
                                  {(data.measurements?.thighs || 0) > (prevData.measurements?.thighs || 0) ? '↑' : (data.measurements?.thighs || 0) < (prevData.measurements?.thighs || 0) ? '↓' : '→'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => setShowMeasurementForm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add New Measurement
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Monthly Measurement Form Modal */}
      {showMeasurementForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#151C2C] rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Add Monthly Measurement</h2>
              <button
                onClick={() => setShowMeasurementForm(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={newMeasurement.date}
                    onChange={(e) => setNewMeasurement({...newMeasurement, date: e.target.value})}
                    className={`w-full p-2 bg-[#1A2234] text-white rounded-lg border ${errors.date ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:border-blue-500`}
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <label className="block text-gray-400 text-sm mb-1">Chest (cm)</label>
                    <div className="group relative cursor-help">
                      <span className="text-blue-500 text-xs">How to measure?</span>
                      <div className="absolute right-0 top-6 w-64 p-2 bg-[#2A3346] text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        Measure around the fullest part of your chest, keeping the tape horizontal.
                      </div>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={newMeasurement.chest}
                    onChange={(e) => setNewMeasurement({...newMeasurement, chest: e.target.value})}
                    placeholder="Chest circumference in cm"
                    className={`w-full p-2 bg-[#1A2234] text-white rounded-lg border ${errors.chest ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:border-blue-500`}
                  />
                  {errors.chest && <p className="text-red-500 text-xs mt-1">{errors.chest}</p>}
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <label className="block text-gray-400 text-sm mb-1">Waist (cm)</label>
                    <div className="group relative cursor-help">
                      <span className="text-blue-500 text-xs">How to measure?</span>
                      <div className="absolute right-0 top-6 w-64 p-2 bg-[#2A3346] text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        Measure around your natural waistline, at the narrowest part of your waist.
                      </div>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={newMeasurement.waist}
                    onChange={(e) => setNewMeasurement({...newMeasurement, waist: e.target.value})}
                    placeholder="Waist circumference in cm"
                    className={`w-full p-2 bg-[#1A2234] text-white rounded-lg border ${errors.waist ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:border-blue-500`}
                  />
                  {errors.waist && <p className="text-red-500 text-xs mt-1">{errors.waist}</p>}
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <label className="block text-gray-400 text-sm mb-1">Hips (cm)</label>
                    <div className="group relative cursor-help">
                      <span className="text-blue-500 text-xs">How to measure?</span>
                      <div className="absolute right-0 top-6 w-64 p-2 bg-[#2A3346] text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        Measure around the fullest part of your hips.
                      </div>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={newMeasurement.hips}
                    onChange={(e) => setNewMeasurement({...newMeasurement, hips: e.target.value})}
                    placeholder="Hip circumference in cm"
                    className={`w-full p-2 bg-[#1A2234] text-white rounded-lg border ${errors.hips ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:border-blue-500`}
                  />
                  {errors.hips && <p className="text-red-500 text-xs mt-1">{errors.hips}</p>}
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <label className="block text-gray-400 text-sm mb-1">Biceps (cm)</label>
                    <div className="group relative cursor-help">
                      <span className="text-blue-500 text-xs">How to measure?</span>
                      <div className="absolute right-0 top-6 w-64 p-2 bg-[#2A3346] text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        Measure around the fullest part of your flexed bicep.
                      </div>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={newMeasurement.biceps}
                    onChange={(e) => setNewMeasurement({...newMeasurement, biceps: e.target.value})}
                    placeholder="Biceps circumference in cm"
                    className={`w-full p-2 bg-[#1A2234] text-white rounded-lg border ${errors.biceps ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:border-blue-500`}
                  />
                  {errors.biceps && <p className="text-red-500 text-xs mt-1">{errors.biceps}</p>}
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <label className="block text-gray-400 text-sm mb-1">Thighs (cm)</label>
                    <div className="group relative cursor-help">
                      <span className="text-blue-500 text-xs">How to measure?</span>
                      <div className="absolute right-0 top-6 w-64 p-2 bg-[#2A3346] text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        Measure around the fullest part of your thigh, just below your buttock.
                      </div>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={newMeasurement.thighs}
                    onChange={(e) => setNewMeasurement({...newMeasurement, thighs: e.target.value})}
                    placeholder="Thigh circumference in cm"
                    className={`w-full p-2 bg-[#1A2234] text-white rounded-lg border ${errors.thighs ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:border-blue-500`}
                  />
                  {errors.thighs && <p className="text-red-500 text-xs mt-1">{errors.thighs}</p>}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <p className="text-xs text-gray-400 self-center">Fields with <span className="text-red-500">*</span> are required</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowMeasurementForm(false);
                      setErrors({});
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveMeasurement}
                    disabled={isSubmitting}
                    className={`px-4 py-2 ${isSubmitting ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors flex items-center gap-2`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Measurement
                      </>
                    )}
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
