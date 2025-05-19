"use client";

import React, { useState } from 'react';
import { 
  Heart, 
  Moon, 
  Droplets, 
  Scale, 
  Battery, 
  Apple, 
  Smile, 
  Check, 
  Calendar,
  Activity,
  TrendingUp,
  LineChart
} from 'lucide-react';
import DailyHealthCheckIn from '../components/daily-health-check-in';

interface HealthMetrics {
  date: string;
  time: string;
  weight: number;
  sleep: number;
  water: number;
  energy: number;
  stress: number;
  mood: 'great' | 'good' | 'okay' | 'poor';
  nutrition: {
    meals: number;
    quality: number;
  };
}

export default function HealthPage() {
  // We're removing the modal state since we're only using one form
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [healthData, setHealthData] = useState<HealthMetrics[]>([
    {
      date: '2025-05-15',
      time: '08:00',
      weight: 78,
      sleep: 7.5,
      water: 2.5,
      energy: 8,
      stress: 3,
      mood: 'great',
      nutrition: {
        meals: 3,
        quality: 9
      }
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  
  React.useEffect(() => {
    fetchLatestHealthData();
  }, []);
  
  const fetchLatestHealthData = async () => {
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch(`/api/members/health-check?startDate=${today}&endDate=${today}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch health check-in data');
      }
      
      const data = await response.json();
      
      if (data.success && data.healthCheckIns && data.healthCheckIns.length > 0) {
        const checkIn = data.healthCheckIns[0];
        
        // Map the API data to our HealthMetrics format
        setHealthData([{
          date: new Date(checkIn.date).toISOString().split('T')[0],
          time: new Date(checkIn.createdAt || checkIn.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          weight: checkIn.weight || 0,
          sleep: checkIn.sleepHours || 0,
          water: checkIn.waterIntake || 0,
          energy: checkIn.energyLevel === 'High' ? 8 : checkIn.energyLevel === 'Medium' ? 5 : 3,
          stress: checkIn.stressLevel === 'High' ? 8 : checkIn.stressLevel === 'Medium' ? 5 : 2,
          mood: convertMood(checkIn.mood),
          nutrition: {
            meals: 3, // Default value as we don't track meals separately yet
            quality: convertNutritionQuality(checkIn.nutritionQuality)
          }
        }]);
      }
    } catch (err) {
      console.error('Error fetching health data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper functions to convert API data values to our UI format
  const convertMood = (mood?: string): 'great' | 'good' | 'okay' | 'poor' => {
    if (!mood) return 'okay';
    
    switch (mood) {
      case 'Excellent': return 'great';
      case 'Good': return 'good';
      case 'Neutral': return 'okay';
      case 'Poor':
      case 'Terrible': return 'poor';
      default: return 'okay';
    }
  };
  
  const convertNutritionQuality = (quality?: string): number => {
    if (!quality) return 5;
    
    switch (quality) {
      case 'Excellent': return 9;
      case 'Good': return 7;
      case 'Average': return 5;
      case 'Poor': return 3;
      case 'Terrible': return 1;
      default: return 5;
    }
  };

  const moodEmojis = {
    great: '😃',
    good: '🙂',
    okay: '😐',
    poor: '😕'
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">Daily Health Check-In</h1>
          <p className="text-gray-400">Track your daily wellness metrics</p>
        </div>
      </div>
      
      {/* Health Check-In Component */}
      <div className="mb-8">
        <DailyHealthCheckIn onUpdateHealth={fetchLatestHealthData} />
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Sleep Quality</div>
            <Moon className="w-5 h-5 text-blue-500" />
          </div>
          {isLoading ? (
            <div className="animate-pulse h-8 bg-gray-700 rounded w-24 mb-2"></div>
          ) : (
            <>
              <div className="text-2xl font-semibold text-white">{healthData[0].sleep} hrs</div>
              <div className="text-sm text-blue-500 mt-2">
                {healthData[0].sleep >= 7 ? 'Good sleep duration' : 'Below recommended'}
              </div>
            </>
          )}
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Water Intake</div>
            <Droplets className="w-5 h-5 text-blue-500" />
          </div>
          {isLoading ? (
            <div className="animate-pulse h-8 bg-gray-700 rounded w-24 mb-2"></div>
          ) : (
            <>
              <div className="text-2xl font-semibold text-white">{healthData[0].water}L</div>
              <div className="text-sm text-blue-500 mt-2">
                {healthData[0].water >= 2.5 ? 'Well hydrated' : 'Drink more water'}
              </div>
            </>
          )}
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Energy Level</div>
            <Battery className="w-5 h-5 text-green-500" />
          </div>
          {isLoading ? (
            <div className="animate-pulse h-8 bg-gray-700 rounded w-24 mb-2"></div>
          ) : (
            <>
              <div className="text-2xl font-semibold text-white">{healthData[0].energy}/10</div>
              <div className="text-sm text-green-500 mt-2">
                {healthData[0].energy >= 7 ? 'High energy' : 'Below average'}
              </div>
            </>
          )}
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Stress Level</div>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          {isLoading ? (
            <div className="animate-pulse h-8 bg-gray-700 rounded w-24 mb-2"></div>
          ) : (
            <>
              <div className="text-2xl font-semibold text-white">{healthData[0].stress}/10</div>
              <div className="text-sm text-green-500 mt-2">
                {healthData[0].stress <= 4 ? 'Low stress' : 'High stress'}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detailed Health Card */}
      <div className="bg-[#151C2C] p-6 rounded-xl mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-medium text-white">Today's Health Summary</h2>
            {!isLoading && <p className="text-gray-400 text-sm">Last check-in: {healthData[0].time}</p>}
          </div>
          {!isLoading && <div className="text-4xl">{moodEmojis[healthData[0].mood]}</div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Metrics */}
          <div className="space-y-4">
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-400">Mood</div>
                {isLoading ? (
                  <div className="animate-pulse h-5 bg-gray-700 rounded w-16"></div>
                ) : (
                  <div className="text-white capitalize">{healthData[0].mood}</div>
                )}
              </div>
              <div className="h-2 bg-[#151C2C] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: isLoading ? '50%' : `${
                    (healthData[0].mood === 'great' ? 100 :
                     healthData[0].mood === 'good' ? 75 :
                     healthData[0].mood === 'okay' ? 50 : 25)}%`
                  }}
                />
              </div>
            </div>

            <div className="bg-[#1A2234] p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-400">Nutrition Quality</div>
                {isLoading ? (
                  <div className="animate-pulse h-5 bg-gray-700 rounded w-12"></div>
                ) : (
                  <div className="text-white">{healthData[0].nutrition.quality}/10</div>
                )}
              </div>
              <div className="h-2 bg-[#151C2C] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: isLoading ? '50%' : `${(healthData[0].nutrition.quality / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[#1A2234] p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="text-gray-400">Meals Tracked</div>
                {isLoading ? (
                  <div className="animate-pulse h-5 bg-gray-700 rounded w-16"></div>
                ) : (
                  <div className="text-white">{healthData[0].nutrition.meals} meals</div>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-[#1A2234] p-4 rounded-lg">
            <h3 className="text-white font-medium mb-4">Daily Recommendations</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-gray-400">Get 7-9 hours of sleep tonight</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-gray-400">Increase water intake to 3L</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-gray-400">Take regular breaks to manage stress</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <p className="text-gray-400">Include protein in your next meal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Trends Placeholder */}
      <div className="bg-[#151C2C] rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <LineChart className="text-yellow-500 w-5 h-5" />
            <h2 className="text-lg font-medium text-white">Your Trends</h2>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-400">Refreshing...</span>
            </div>
          )}
        </div>
        
        <div className="h-40 flex items-center justify-center border border-gray-700 rounded-lg bg-[#1A2234]">
          <p className="text-gray-400 text-sm">Health trends will appear after multiple check-ins</p>
        </div>
        
        <button onClick={fetchLatestHealthData} className="mt-4 w-full py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>View Detailed Analytics</span>
        </button>
      </div>
    </div>
  );
}
