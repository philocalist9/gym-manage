"use client";

import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Camera,
  Key,
  Shield,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface GymOwnerProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  gymName: string;
  gymAddress?: string;
  gymPhone?: string;
  gymEmail?: string;
  registrationDate: string;
  membershipType: string;
  subscriptionStatus: string;
}

interface GymData {
  _id: string;
  gymName: string;
  ownerName: string;
  address: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gymData, setGymData] = useState<GymData | null>(null);
  
  const [profile, setProfile] = useState<GymOwnerProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    gymName: "",
    gymAddress: "",
    gymPhone: "",
    gymEmail: "",
    registrationDate: "",
    membershipType: "Standard",
    subscriptionStatus: "Active",
  });

  const [newPassword, setNewPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  
  useEffect(() => {
    const fetchGymData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/gym');
        
        if (!response.ok) {
          if (response.status === 401) {
            // Not authenticated, redirect to login
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch gym data');
        }
        
        const data = await response.json();
        setGymData(data.gym);
        
        // Update the profile with fetched data
        setProfile({
          name: data.gym.ownerName || "",
          email: data.gym.email || "",
          phone: data.gym.phone || "",
          address: data.gym.address || "",
          gymName: data.gym.gymName || "",
          gymAddress: data.gym.address || "",
          gymPhone: data.gym.phone || "",
          gymEmail: data.gym.email || "",
          registrationDate: data.gym.createdAt ? 
            format(new Date(data.gym.createdAt), 'yyyy-MM-dd') : 
            format(new Date(), 'yyyy-MM-dd'),
          membershipType: "Standard", // Default values as these might not be in the database yet
          subscriptionStatus: data.gym.status === 'active' ? 'Active' : 'Pending',
        });
        
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching gym data:', err);
        setError(err.message || 'An error occurred while fetching gym data');
        setIsLoading(false);
      }
    };
    
    fetchGymData();
  }, [router]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      
      // Prepare data for API
      const updateData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        gymName: profile.gymName,
        gymAddress: profile.gymAddress,
        gymPhone: profile.gymPhone,
        gymEmail: profile.gymEmail
      };
      
      // Send update request
      const response = await fetch('/api/gym/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Update gymData with the response
      setGymData(data.gym);
      
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setSaveError(err.message || 'An error occurred while updating the profile');
    } finally {
      setIsSaving(false);
    }
  };

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  
  const handlePasswordChange = async () => {
    try {
      setIsChangingPassword(true);
      setPasswordChangeError(null);
      
      // Validate passwords
      if (!newPassword.current || !newPassword.new || !newPassword.confirm) {
        throw new Error('All password fields are required');
      }
      
      if (newPassword.new !== newPassword.confirm) {
        throw new Error('New password and confirmation do not match');
      }
      
      if (newPassword.new.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      // Send password update request
      const response = await fetch('/api/gym/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: newPassword.current,
          newPassword: newPassword.new,
          confirmPassword: newPassword.confirm
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }
      
      // Clear form and show success
      setNewPassword({
        current: '',
        new: '',
        confirm: ''
      });
      
      setPasswordChangeSuccess(true);
      setTimeout(() => setPasswordChangeSuccess(false), 3000);
      
    } catch (err: any) {
      console.error('Error changing password:', err);
      setPasswordChangeError(err.message || 'An error occurred while updating password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account settings and gym information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Photo Section */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
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
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{profile.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{profile.gymName}</p>
              <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4 mr-2" />
                {profile.membershipType} Member
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading profile data...</p>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center justify-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
                <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 mx-auto block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Personal Information */}
          {!isLoading && !error && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        disabled={!isEditing}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        disabled={!isEditing}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        disabled={!isEditing}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                      <input
                        type="text"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        disabled={!isEditing}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            
              {/* Gym Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gym Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gym Name</label>
                      <input
                        type="text"
                        value={profile.gymName}
                        onChange={(e) => setProfile({ ...profile, gymName: e.target.value })}
                        disabled={!isEditing}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gym Email</label>
                      <input
                        type="email"
                        value={profile.gymEmail}
                        onChange={(e) => setProfile({ ...profile, gymEmail: e.target.value })}
                        disabled={!isEditing}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gym Phone</label>
                      <input
                        type="tel"
                        value={profile.gymPhone}
                        onChange={(e) => setProfile({ ...profile, gymPhone: e.target.value })}
                        disabled={!isEditing}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gym Address</label>
                      <input
                        type="text"
                        value={profile.gymAddress}
                        onChange={(e) => setProfile({ ...profile, gymAddress: e.target.value })}
                        disabled={!isEditing}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Security</h3>
                
                {/* Password Change Success Message */}
                {passwordChangeSuccess && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 p-4 rounded-lg mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          Password updated successfully!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Password Change Error Message */}
                {passwordChangeError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-lg mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">
                          {passwordChangeError}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={newPassword.current}
                      onChange={(e) => setNewPassword({ ...newPassword, current: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={isChangingPassword}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword.new}
                      onChange={(e) => setNewPassword({ ...newPassword, new: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={isChangingPassword}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={newPassword.confirm}
                      onChange={(e) => setNewPassword({ ...newPassword, confirm: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={isChangingPassword}
                    />
                  </div>
                  <button
                    onClick={handlePasswordChange}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${
                      isChangingPassword ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Key className="w-4 h-4" />
                    )}
                    {isChangingPassword ? "Updating..." : "Change Password"}
                  </button>
                </div>
              </div>

              {/* Subscription Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subscription Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Registration Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(profile.registrationDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Membership Type</span>
                    <span className="font-medium text-gray-900 dark:text-white">{profile.membershipType}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profile.subscriptionStatus === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {profile.subscriptionStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {saveSuccess && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 p-4 rounded-lg mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Profile updated successfully!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Error Message */}
              {saveError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-lg mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        {saveError}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {isEditing && (
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setSaveError(null);
                    }}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
                      isSaving ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    disabled={isSaving}
                  >
                    {isSaving && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
