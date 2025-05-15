"use client";

import React, { useState } from 'react';
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
  Trophy
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
  const [profile, setProfile] = useState<MemberProfile>({
    personalInfo: {
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      address: "123, Park Street, Mumbai, Maharashtra",
      dateOfBirth: "1995-05-15",
      gender: "Male",
      emergencyContact: "+91 98765 43211",
      bloodGroup: "B+"
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

  const handleSaveProfile = () => {
    setIsEditing(false);
    // TODO: Implement profile update API call
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage your personal information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
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
