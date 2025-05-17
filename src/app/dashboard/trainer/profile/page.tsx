"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Star,
  BarChart2,
  Camera,
  Save,
  Clock,
  Calendar,
  Loader
} from 'lucide-react';

interface TrainerProfile {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    bio: string;
    yearsOfExperience: number;
    specializations: string[];
    gymName: string;
    gymAddress: string;
  };
  expertise: string[];
  statistics: {
    totalClients: number;
    activeClients: number;
    sessionCount: number;
    averageRating: number;
    completionRate: number;
  };
  schedule: {
    day: string;
    availability: {
      start: string;
      end: string;
    }[];
  }[];
}

export default function TrainerProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [profile, setProfile] = useState<TrainerProfile>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      address: "",
      bio: "",
      yearsOfExperience: 0,
      specializations: [],
      gymName: "",
      gymAddress: ""
    },
    expertise: [
      "Weight Training",
      "Functional Training",
      "HIIT",
      "Sports Performance",
      "Injury Recovery",
      "Nutrition Planning"
    ],
    statistics: {
      totalClients: 45,
      activeClients: 28,
      sessionCount: 1250,
      averageRating: 4.8,
      completionRate: 92
    },
    schedule: [
      {
        day: "Monday",
        availability: [
          { start: "06:00", end: "11:00" },
          { start: "16:00", end: "20:00" }
        ]
      },
      {
        day: "Tuesday",
        availability: [
          { start: "06:00", end: "11:00" },
          { start: "16:00", end: "20:00" }
        ]
      },
      {
        day: "Wednesday",
        availability: [
          { start: "06:00", end: "11:00" },
          { start: "16:00", end: "20:00" }
        ]
      },
      {
        day: "Thursday",
        availability: [
          { start: "06:00", end: "11:00" },
          { start: "16:00", end: "20:00" }
        ]
      },
      {
        day: "Friday",
        availability: [
          { start: "06:00", end: "11:00" },
          { start: "16:00", end: "20:00" }
        ]
      },
      {
        day: "Saturday",
        availability: [
          { start: "08:00", end: "12:00" }
        ]
      },
      {
        day: "Sunday",
        availability: []
      }
    ]
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Fetch trainer data
  useEffect(() => {
    if (!user?.id) {
      console.log('User ID not available yet:', user);
      return;
    }
    
    console.log('Fetching trainer data for user:', user);
    const fetchTrainerData = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);
        
        const response = await fetch(`/api/trainers/${user.id}`, {
          credentials: 'include', // Include cookies for authentication
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('API Error:', { status: response.status, data: errorData });
          throw new Error(`Failed to fetch trainer data: ${errorData.error || response.status}`);
        }
        
        const data = await response.json();
        const trainerData = data.trainer;
        
        // Extract gym data from the populated gymId field
        const gymData = trainerData.gymId && typeof trainerData.gymId === 'object' ? trainerData.gymId : null;
        
        console.log('Trainer data from API:', trainerData);
        console.log('Gym data from API:', gymData);
        
        // Map API data to our profile structure
        setProfile({
          personalInfo: {
            name: trainerData.name || "",
            email: trainerData.email || "",
            phone: trainerData.phone || "",
            address: trainerData.address || "",
            bio: trainerData.bio || "",
            yearsOfExperience: trainerData.experience || 0,
            specializations: trainerData.specialization ? [trainerData.specialization] : [],
            gymName: gymData?.gymName || user?.gymName || "",
            gymAddress: gymData?.address || "" // Address from the gym document
          },
          expertise: trainerData.specialization ? 
            [trainerData.specialization, ...profile.expertise.filter(e => e !== trainerData.specialization)] : 
            profile.expertise,
          statistics: {
            totalClients: trainerData.totalClients || 0,
            activeClients: Math.floor(trainerData.totalClients * 0.6) || 0, // Estimating active clients
            sessionCount: trainerData.totalClients * 10 || 0, // Estimating session count
            averageRating: trainerData.rating || 0,
            completionRate: 90 // Default value
          },
          schedule: profile.schedule // Keep existing schedule
        });
      } catch (error) {
        console.error('Error fetching trainer data:', error);
        setFetchError('Failed to load trainer profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrainerData();
  }, [user?.id]); // Only re-fetch when user ID changes

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/trainers/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          name: profile.personalInfo.name,
          email: profile.personalInfo.email,
          phone: profile.personalInfo.phone,
          specialization: profile.personalInfo.specializations[0] || profile.expertise[0],
          bio: profile.personalInfo.bio,
          experience: profile.personalInfo.yearsOfExperience,
          gymName: profile.personalInfo.gymName,
          gymAddress: profile.personalInfo.gymAddress
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      setIsEditing(false);
      
      // Show success message or update UI
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your trainer profile and information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={isLoading}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center p-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">Loading trainer profile...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {fetchError && !isLoading && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 rounded-lg text-red-700 dark:text-red-400">
          <p>{fetchError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm font-medium text-red-800 dark:text-red-300 underline"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !fetchError && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Photo & Quick Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6">
              {/* Profile Photo */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {profile.personalInfo.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {profile.personalInfo.yearsOfExperience} years of experience
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {profile.statistics.activeClients}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Clients</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {profile.statistics.averageRating}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {profile.statistics.sessionCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sessions</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {profile.statistics.completionRate}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completion</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.personalInfo.name}
                      onChange={(e) => setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, name: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.personalInfo.email}
                      onChange={(e) => setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, email: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profile.personalInfo.phone}
                      onChange={(e) => setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, phone: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Gym Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profile.personalInfo.gymName}
                        onChange={(e) => setProfile({
                          ...profile,
                          personalInfo: { ...profile.personalInfo, gymName: e.target.value }
                        })}
                        disabled={!isEditing || user?.role !== 'gym-owner'} 
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        placeholder={!profile.personalInfo.gymName ? "No gym assigned" : ""}
                      />
                      {!profile.personalInfo.gymName && (
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-amber-500">
                          Not assigned
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Personal Address
                    </label>
                    <input
                      type="text"
                      value={profile.personalInfo.address}
                      onChange={(e) => setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, address: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Gym Address
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profile.personalInfo.gymAddress}
                        onChange={(e) => setProfile({
                          ...profile,
                          personalInfo: { ...profile.personalInfo, gymAddress: e.target.value }
                        })}
                        disabled={!isEditing || user?.role !== 'gym-owner'}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        placeholder={!profile.personalInfo.gymAddress ? "No gym address available" : ""}
                      />
                      {!profile.personalInfo.gymAddress && (
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-amber-500">
                          Not available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={profile.personalInfo.bio}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, bio: e.target.value }
                    })}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Expertise */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profile.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
                {isEditing && (
                  <button className="px-3 py-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-400 text-sm hover:border-blue-600 hover:text-blue-600 transition-colors">
                    + Add Skill
                  </button>
                )}
              </div>
            </div>

            {/* Schedule Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Schedule Overview</h3>
              <div className="space-y-4">
                {profile.schedule.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-24 font-medium text-gray-900 dark:text-white">{day.day}</div>
                    <div className="flex-1">
                      {day.availability.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {day.availability.map((slot, slotIndex) => (
                            <span
                              key={slotIndex}
                              className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                            >
                              {slot.start} - {slot.end}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600 dark:text-gray-400">Not Available</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
