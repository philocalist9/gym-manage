"use client";

import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Weight,
  Heart,
  Target,
  Camera,
  Save,
  Dumbbell,
  Scale,
  Trophy,
  Building,
  Home,
  UserCheck
} from 'lucide-react';

interface MemberProfile {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    gender: string;
    emergencyContact: string;
    bloodGroup: string;
    gymName: string;
    gymAddress: string;
    trainerName: string;
  };
  membershipDetails: {
    memberId: string;
    plan: string;
    startDate: string;
    endDate: string;
    status: string;
    trainer: string;
  };
  healthMetrics: {
    height: number;
    weight: number;
    bmi: number;
    bodyFat: number;
    bloodPressure: string;
    restingHeartRate: number;
  };
  fitnessGoals: {
    primaryGoal: string;
    targetWeight: number;
    weeklyWorkoutTarget: number;
    preferredWorkoutTime: string;
    dietaryPreferences: string[];
  };
  achievements: {
    workoutsCompleted: number;
    daysStreak: number;
    personalRecords: number;
    weightLost: number;
  };
}

export default function MemberProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<MemberProfile>({
    personalInfo: {
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      address: "123, Park Street, Mumbai, Maharashtra",
      dateOfBirth: "1995-05-15",
      gender: "Male",
      emergencyContact: "+91 98765 43211",
      bloodGroup: "B+",
      gymName: "Loading...",
      gymAddress: "Loading...",
      trainerName: "Loading..."
    },
    membershipDetails: {
      memberId: "MEM001",
      plan: "Premium Annual",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      status: "Active",
      trainer: "Virat Kohli"
    },
    healthMetrics: {
      height: 175,
      weight: 75,
      bmi: 24.5,
      bodyFat: 18,
      bloodPressure: "120/80",
      restingHeartRate: 68
    },
    fitnessGoals: {
      primaryGoal: "Weight Loss",
      targetWeight: 70,
      weeklyWorkoutTarget: 5,
      preferredWorkoutTime: "Morning",
      dietaryPreferences: ["Vegetarian", "Low Carb"]
    },
    achievements: {
      workoutsCompleted: 48,
      daysStreak: 15,
      personalRecords: 5,
      weightLost: 3
    }
  });
  
  // Fetch member data from the API
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch current user data to get member ID
        const userResponse = await fetch('/api/auth/user');
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await userResponse.json();
        const user = userData.user;
        
        if (!user || user.role !== 'member') {
          throw new Error('User is not a member');
        }
        
        // Fetch detailed member data (includes gymId)
        const memberId = user.id;
        const memberResponse = await fetch(`/api/members/${memberId}`);
        
        if (!memberResponse.ok) {
          const errorData = await memberResponse.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Member fetch failed:', errorData);
          throw new Error(`Failed to fetch member details: ${errorData.error || 'Unknown error'}`);
        }
        
        const memberData = await memberResponse.json();
        const member = memberData.member;
        
        // Fetch gym data based on member's gymId
        let gymName = 'N/A';
        let gymAddress = 'N/A';
        
        if (member.gymId) {
          try {
            // Create a dedicated endpoint for members to fetch gym info
            const gymResponse = await fetch('/api/members/gym', {
              // Add cache control to prevent stale data
              cache: 'no-cache',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            if (gymResponse.ok) {
              const gymData = await gymResponse.json();
              if (gymData.gym) {
                gymName = gymData.gym.name;
                gymAddress = gymData.gym.address;
                console.log('Gym data fetched successfully');
              } else {
                console.warn('Gym data is empty or incomplete');
              }
            } else {
              const errorText = await gymResponse.text().catch(() => 'Unknown error');
              console.error(`Failed to fetch gym data (${gymResponse.status}):`, errorText);
            }
          } catch (gymError) {
            console.error('Error fetching gym data:', gymError);
          }
        } else {
          console.warn('No gymId found for this member');
        }
        
        // Fetch trainer data if member has a trainer
        let trainerName = 'No trainer assigned';
        
        if (member.trainer) {
          try {
            const trainerId = typeof member.trainer === 'string' ? member.trainer : member.trainer.toString();
            const trainerResponse = await fetch(`/api/trainers/${trainerId}`, {
              // Add cache control to prevent stale data
              cache: 'no-cache',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            if (trainerResponse.ok) {
              const trainerData = await trainerResponse.json();
              if (trainerData.trainer && trainerData.trainer.name) {
                trainerName = trainerData.trainer.name;
              } else {
                console.warn('Trainer data missing or incomplete');
              }
            } else {
              console.error(`Failed to fetch trainer data (${trainerResponse.status})`);
            }
          } catch (trainerError) {
            console.error('Error fetching trainer data:', trainerError);
          }
        } else {
          console.log('No trainer assigned to this member');
        }
        
        // Update profile state with fetched data
        setProfile(prevProfile => ({
          ...prevProfile,
          personalInfo: {
            ...prevProfile.personalInfo,
            name: member.name || prevProfile.personalInfo.name,
            email: member.email || prevProfile.personalInfo.email,
            phone: member.phone || prevProfile.personalInfo.phone,
            gymName,
            gymAddress,
            trainerName
          },
          membershipDetails: {
            ...prevProfile.membershipDetails,
            memberId: member.memberNumber || prevProfile.membershipDetails.memberId,
            plan: member.membershipType || prevProfile.membershipDetails.plan,
            status: member.status || prevProfile.membershipDetails.status,
            startDate: member.joiningDate ? new Date(member.joiningDate).toISOString().split('T')[0] : prevProfile.membershipDetails.startDate,
            endDate: member.nextPayment ? new Date(member.nextPayment).toISOString().split('T')[0] : prevProfile.membershipDetails.endDate,
            trainer: trainerName
          }
        }));
      } catch (err: any) {
        console.error('Error fetching member data:', err);
        setError(err.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMemberData();
  }, []);
  
  // Retry loading data if there was an error
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Rerun the useEffect by forcing a component update
    setProfile(prev => ({...prev}));
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // TODO: Implement profile update API call
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage your personal information</p>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="text-sm text-blue-600 dark:text-blue-400 animate-pulse flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading data...
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2">
              <div className="text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
              <button 
                onClick={handleRetry}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Retry
              </button>
            </div>
          )}
          {!isLoading && !error && (
            isEditing ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            )
          )}
        </div>
      </div>

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
                Member ID: {profile.membershipDetails.memberId}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {profile.achievements.workoutsCompleted}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Workouts</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {profile.achievements.daysStreak}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Days Streak</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {profile.achievements.personalRecords}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Records</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {profile.achievements.weightLost}kg
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Weight Lost</div>
              </div>
            </div>

            {/* Membership Status */}
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
              <h3 className="text-lg font-semibold mb-2">Membership Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <span className="font-medium">{profile.membershipDetails.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valid Till:</span>
                  <span className="font-medium">
                    {new Date(profile.membershipDetails.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="px-2 py-1 bg-green-500 rounded-full text-xs font-semibold">
                    {profile.membershipDetails.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
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
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  value={profile.personalInfo.emergencyContact}
                  onChange={(e) => setProfile({
                    ...profile,
                    personalInfo: { ...profile.personalInfo, emergencyContact: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
              
              {/* Gym Information Section */}
              <div className="md:col-span-2 mt-4">
                <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Gym Information
                </h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4 text-blue-500" />
                    <span>Gym Name</span>
                  </div>
                </label>
                <div className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
                  {isLoading ? (
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    profile.personalInfo.gymName
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <div className="flex items-center gap-1">
                    <Home className="w-4 h-4 text-blue-500" />
                    <span>Gym Address</span>
                  </div>
                </label>
                <div className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
                  {isLoading ? (
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    profile.personalInfo.gymAddress
                  )}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <div className="flex items-center gap-1">
                    <UserCheck className="w-4 h-4 text-blue-500" />
                    <span>Assigned Trainer</span>
                  </div>
                </label>
                <div className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center">
                  {isLoading ? (
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                  ) : (
                    <>
                      {profile.personalInfo.trainerName === 'No trainer assigned' ? (
                        <span className="text-gray-500 dark:text-gray-400">{profile.personalInfo.trainerName}</span>
                      ) : (
                        profile.personalInfo.trainerName
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Health Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Weight</span>
                </div>
                <div className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {profile.healthMetrics.weight} kg
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">BMI</span>
                </div>
                <div className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {profile.healthMetrics.bmi}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Heart Rate</span>
                </div>
                <div className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {profile.healthMetrics.restingHeartRate} bpm
                </div>
              </div>
            </div>
          </div>

          {/* Fitness Goals */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fitness Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Primary Goal
                </label>
                <select
                  value={profile.fitnessGoals.primaryGoal}
                  onChange={(e) => setProfile({
                    ...profile,
                    fitnessGoals: { ...profile.fitnessGoals, primaryGoal: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Strength Training">Strength Training</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Weight
                </label>
                <input
                  type="number"
                  value={profile.fitnessGoals.targetWeight}
                  onChange={(e) => setProfile({
                    ...profile,
                    fitnessGoals: { ...profile.fitnessGoals, targetWeight: parseInt(e.target.value) }
                  })}
                  disabled={!isEditing}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Weekly Workout Target
                </label>
                <input
                  type="number"
                  value={profile.fitnessGoals.weeklyWorkoutTarget}
                  onChange={(e) => setProfile({
                    ...profile,
                    fitnessGoals: { ...profile.fitnessGoals, weeklyWorkoutTarget: parseInt(e.target.value) }
                  })}
                  disabled={!isEditing}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preferred Workout Time
                </label>
                <select
                  value={profile.fitnessGoals.preferredWorkoutTime}
                  onChange={(e) => setProfile({
                    ...profile,
                    fitnessGoals: { ...profile.fitnessGoals, preferredWorkoutTime: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>
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
    </div>
  );
}
