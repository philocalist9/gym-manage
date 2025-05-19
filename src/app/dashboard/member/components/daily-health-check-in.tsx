"use client";

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Moon, 
  Activity, 
  Droplet, 
  Utensils, 
  Weight, 
  Smile, 
  Frown,
  Calendar,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface HealthCheckInData {
  date: string;
  weight?: number;
  sleepHours?: number;
  stressLevel?: 'Low' | 'Medium' | 'High';
  mood?: 'Excellent' | 'Good' | 'Neutral' | 'Poor' | 'Terrible';
  energyLevel?: 'High' | 'Medium' | 'Low';
  waterIntake?: number;
  nutritionQuality?: 'Excellent' | 'Good' | 'Average' | 'Poor' | 'Terrible';
  soreness?: {
    level: 'None' | 'Mild' | 'Moderate' | 'Severe';
    areas: string[];
  };
  notes?: string;
}

interface DailyHealthCheckInProps {
  onUpdateHealth?: () => void;
}

export default function DailyHealthCheckIn({ onUpdateHealth }: DailyHealthCheckInProps) {
  const [healthData, setHealthData] = useState<HealthCheckInData>({
    date: new Date().toISOString().split('T')[0],
    soreness: {
      level: 'None',
      areas: []
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [savedData, setSavedData] = useState<HealthCheckInData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // Form is hidden by default
  
  // Body areas for soreness tracking
  const bodyAreas = [
    'Neck', 'Shoulders', 'Upper Back', 'Lower Back', 'Chest', 
    'Biceps', 'Triceps', 'Forearms', 'Abs', 'Glutes', 
    'Quads', 'Hamstrings', 'Calves', 'Ankles'
  ];
  
  useEffect(() => {
    // Fetch today's check-in data if it exists
    fetchTodaysCheckIn();
  }, []);
  
  // Auto-hide notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  // Auto-hide form if data is already saved for today
  useEffect(() => {
    if (savedData) {
      setIsFormVisible(false);
    }
  }, [savedData]);
  
  const fetchTodaysCheckIn = async () => {
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch(`/api/members/health-check?startDate=${today}&endDate=${today}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch today\'s health check-in');
      }
      
      const data = await response.json();
      
      if (data.success && data.healthCheckIns && data.healthCheckIns.length > 0) {
        const checkIn = data.healthCheckIns[0];
        setSavedData(checkIn);
        
        // Format the date
        const date = new Date(checkIn.date).toISOString().split('T')[0];
        
        // Update the form with saved data
        setHealthData({
          date,
          weight: checkIn.weight,
          sleepHours: checkIn.sleepHours,
          stressLevel: checkIn.stressLevel,
          mood: checkIn.mood,
          energyLevel: checkIn.energyLevel,
          waterIntake: checkIn.waterIntake,
          nutritionQuality: checkIn.nutritionQuality,
          soreness: checkIn.soreness || { level: 'None', areas: [] },
          notes: checkIn.notes
        });
      }
    } catch (err) {
      console.error('Error fetching health check-in:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHealthData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSorenessLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setHealthData(prev => ({
      ...prev,
      soreness: {
        ...prev.soreness!,
        level: value as 'None' | 'Mild' | 'Moderate' | 'Severe'
      }
    }));
  };
  
  const handleSorenessAreaToggle = (area: string) => {
    setHealthData(prev => {
      const currentAreas = prev.soreness?.areas || [];
      let updatedAreas: string[];
      
      if (currentAreas.includes(area)) {
        updatedAreas = currentAreas.filter(a => a !== area);
      } else {
        updatedAreas = [...currentAreas, area];
      }
      
      return {
        ...prev,
        soreness: {
          ...prev.soreness!,
          areas: updatedAreas
        }
      };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // If soreness level is None, clear the areas
      const dataToSubmit = {
        ...healthData,
        soreness: {
          level: healthData.soreness?.level || 'None',
          areas: healthData.soreness?.level === 'None' ? [] : healthData.soreness?.areas
        }
      };
      
      const response = await fetch('/api/members/health-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save health check-in: ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSavedData(data.healthCheckIn);
        setNotification({
          type: 'success',
          message: 'Health check-in saved successfully!'
        });
        
        // Refresh page data to ensure all components are updated
        fetchTodaysCheckIn();
        
        // Notify parent component that health data has been updated
        if (onUpdateHealth) {
          onUpdateHealth();
        }
      }
    } catch (err) {
      console.error('Error saving health check-in:', err);
      setError(err instanceof Error ? err.message : 'Failed to save data');
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save check-in'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-[#151C2C] rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Heart className="text-red-500 w-5 h-5" />
          <h2 className="text-lg font-medium text-white">Daily Health Check-In</h2>
        </div>
        <div className="text-sm text-gray-400">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Button to toggle form visibility */}
      <button
        type="button"
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-all duration-200 mb-6"
      >
        {isFormVisible ? (
          <>
            <Save className="w-5 h-5" />
            <span>Hide Check-In Form</span>
          </>
        ) : (
          <>
            <Heart className="w-5 h-5" />
            <span>{savedData ? 'Update Health Check-In' : 'Complete Health Check-In'}</span>
          </>
        )}
      </button>
      
      {notification && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          notification.type === 'success' 
            ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
            : 'bg-red-500/10 text-red-400 border border-red-500/30'
        }`}>
          {notification.type === 'success' ? 
            <CheckCircle className="w-5 h-5" /> : 
            <AlertCircle className="w-5 h-5" />
          }
          <span>{notification.message}</span>
        </div>
      )}
      
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Weight Section */}
        <div className="p-4 bg-[#1A2234] rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Weight className="text-blue-400 w-5 h-5" />
            <h3 className="text-white font-medium">Weight</h3>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              name="weight"
              value={healthData.weight || ''}
              onChange={handleInputChange}
              step="0.1"
              min="0"
              placeholder="Weight"
              className="bg-[#151C2C] text-white border border-gray-700 rounded-lg px-3 py-2 w-full"
            />
            <span className="text-gray-400 whitespace-nowrap">kg</span>
          </div>
        </div>
        
        {/* Sleep Section */}
        <div className="p-4 bg-[#1A2234] rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Moon className="text-indigo-400 w-5 h-5" />
            <h3 className="text-white font-medium">Sleep</h3>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              name="sleepHours"
              value={healthData.sleepHours || ''}
              onChange={handleInputChange}
              step="0.5"
              min="0"
              max="24"
              placeholder="Hours"
              className="bg-[#151C2C] text-white border border-gray-700 rounded-lg px-3 py-2 w-full"
            />
            <span className="text-gray-400 whitespace-nowrap">hours</span>
          </div>
        </div>
        
        {/* Energy & Stress Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#1A2234] rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="text-green-400 w-5 h-5" />
              <h3 className="text-white font-medium">Energy Level</h3>
            </div>
            <select
              name="energyLevel"
              value={healthData.energyLevel || ''}
              onChange={handleInputChange}
              className="bg-[#151C2C] text-white border border-gray-700 rounded-lg px-3 py-2 w-full"
            >
              <option value="">Select level</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          
          <div className="p-4 bg-[#1A2234] rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="text-yellow-400 w-5 h-5" />
              <h3 className="text-white font-medium">Stress Level</h3>
            </div>
            <select
              name="stressLevel"
              value={healthData.stressLevel || ''}
              onChange={handleInputChange}
              className="bg-[#151C2C] text-white border border-gray-700 rounded-lg px-3 py-2 w-full"
            >
              <option value="">Select level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
        
        {/* Mood & Nutrition Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#1A2234] rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Smile className="text-amber-400 w-5 h-5" />
              <h3 className="text-white font-medium">Mood</h3>
            </div>
            <select
              name="mood"
              value={healthData.mood || ''}
              onChange={handleInputChange}
              className="bg-[#151C2C] text-white border border-gray-700 rounded-lg px-3 py-2 w-full"
            >
              <option value="">Select mood</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Neutral">Neutral</option>
              <option value="Poor">Poor</option>
              <option value="Terrible">Terrible</option>
            </select>
          </div>
          
          <div className="p-4 bg-[#1A2234] rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Utensils className="text-pink-400 w-5 h-5" />
              <h3 className="text-white font-medium">Nutrition Quality</h3>
            </div>
            <select
              name="nutritionQuality"
              value={healthData.nutritionQuality || ''}
              onChange={handleInputChange}
              className="bg-[#151C2C] text-white border border-gray-700 rounded-lg px-3 py-2 w-full"
            >
              <option value="">Select quality</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
              <option value="Terrible">Terrible</option>
            </select>
          </div>
        </div>
        
        {/* Water Intake */}
        <div className="p-4 bg-[#1A2234] rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Droplet className="text-blue-400 w-5 h-5" />
            <h3 className="text-white font-medium">Water Intake</h3>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              name="waterIntake"
              value={healthData.waterIntake || ''}
              onChange={handleInputChange}
              step="0.1"
              min="0"
              placeholder="Water intake"
              className="bg-[#151C2C] text-white border border-gray-700 rounded-lg px-3 py-2 w-full"
            />
            <span className="text-gray-400 whitespace-nowrap">liters</span>
          </div>
        </div>
        
        {/* Soreness Section */}
        <div className="p-4 bg-[#1A2234] rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Frown className="text-red-400 w-5 h-5" />
            <h3 className="text-white font-medium">Muscle Soreness</h3>
          </div>
          
          <div className="mb-4">
            <select
              value={healthData.soreness?.level || 'None'}
              onChange={handleSorenessLevelChange}
              className="bg-[#151C2C] text-white border border-gray-700 rounded-lg px-3 py-2 w-full"
            >
              <option value="None">None</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>
          
          {healthData.soreness?.level !== 'None' && (
            <div>
              <p className="text-sm text-gray-400 mb-3">Select sore areas:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {bodyAreas.map(area => (
                  <div 
                    key={area}
                    onClick={() => handleSorenessAreaToggle(area)}
                    className={`py-2 px-3 rounded-lg cursor-pointer text-center text-sm ${
                      healthData.soreness?.areas.includes(area)
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-[#151C2C] text-gray-400 border border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {area}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Notes Section */}
        <div className="p-4 bg-[#1A2234] rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="text-purple-400 w-5 h-5" />
            <h3 className="text-white font-medium">Notes</h3>
          </div>
          <textarea
            name="notes"
            value={healthData.notes || ''}
            onChange={handleInputChange}
            placeholder="Any additional notes about your health today..."
            className="bg-[#151C2C] text-white border border-gray-700 rounded-lg px-3 py-2 w-full h-24 resize-none"
            maxLength={500}
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
            isLoading
              ? 'bg-blue-500/50 text-white/70 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Health Check-In</span>
            </>
          )}
        </button>
      </form>
      )}

      {savedData && !isFormVisible && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-medium">Today's Check-In Summary</h3>
            <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
              Completed
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {savedData.weight && (
              <div>
                <span className="text-gray-400 block">Weight</span>
                <span className="text-white">{savedData.weight} kg</span>
              </div>
            )}
            
            {savedData.sleepHours && (
              <div>
                <span className="text-gray-400 block">Sleep</span>
                <span className="text-white">{savedData.sleepHours} hours</span>
              </div>
            )}
            
            {savedData.mood && (
              <div>
                <span className="text-gray-400 block">Mood</span>
                <span className="text-white">{savedData.mood}</span>
              </div>
            )}
            
            {savedData.energyLevel && (
              <div>
                <span className="text-gray-400 block">Energy</span>
                <span className="text-white">{savedData.energyLevel}</span>
              </div>
            )}
            
            {savedData.stressLevel && (
              <div>
                <span className="text-gray-400 block">Stress</span>
                <span className="text-white">{savedData.stressLevel}</span>
              </div>
            )}
            
            {savedData.waterIntake && (
              <div>
                <span className="text-gray-400 block">Water</span>
                <span className="text-white">{savedData.waterIntake} L</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
