"use client";

import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Edit2, Save, X as XIcon } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergency: {
    name: string;
    phone: string;
    relation: string;
  };
  healthInfo: {
    height: number;
    bloodType: string;
    allergies: string[];
    medications: string[];
  };
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    dateOfBirth: '1990-05-15',
    address: '123 Fitness Street, Gym City, GC 12345',
    emergency: {
      name: 'Jane Doe',
      phone: '+1 234 567 8901',
      relation: 'Spouse'
    },
    healthInfo: {
      height: 175,
      bloodType: 'O+',
      allergies: ['Peanuts'],
      medications: ['None']
    }
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-[#151C2C] rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Profile Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <XIcon className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-[#1A2234] p-6 rounded-lg">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Personal Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-3 py-2 bg-[#151C2C] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-white">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full px-3 py-2 bg-[#151C2C] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-white">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full px-3 py-2 bg-[#151C2C] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-white">{profile.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                  className="w-full px-3 py-2 bg-[#151C2C] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-white">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Address</label>
              {isEditing ? (
                <textarea
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  className="w-full px-3 py-2 bg-[#151C2C] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                  rows={2}
                />
              ) : (
                <p className="text-white">{profile.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-[#1A2234] p-6 rounded-lg">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-500" />
            Emergency Contact
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Contact Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.emergency.name}
                  onChange={(e) => setProfile({
                    ...profile,
                    emergency: {...profile.emergency, name: e.target.value}
                  })}
                  className="w-full px-3 py-2 bg-[#151C2C] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-white">{profile.emergency.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Contact Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.emergency.phone}
                  onChange={(e) => setProfile({
                    ...profile,
                    emergency: {...profile.emergency, phone: e.target.value}
                  })}
                  className="w-full px-3 py-2 bg-[#151C2C] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-white">{profile.emergency.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Relationship</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.emergency.relation}
                  onChange={(e) => setProfile({
                    ...profile,
                    emergency: {...profile.emergency, relation: e.target.value}
                  })}
                  className="w-full px-3 py-2 bg-[#151C2C] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-white">{profile.emergency.relation}</p>
              )}
            </div>
          </div>
        </div>

        {/* Health Information */}
        <div className="bg-[#1A2234] p-6 rounded-lg md:col-span-2">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            Health Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Height (cm)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.healthInfo.height}
                    onChange={(e) => setProfile({
                      ...profile,
                      healthInfo: {...profile.healthInfo, height: Number(e.target.value)}
                    })}
                    className="w-full px-3 py-2 bg-[#151C2C] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-white">{profile.healthInfo.height} cm</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Blood Type</label>
                {isEditing ? (
                  <select
                    value={profile.healthInfo.bloodType}
                    onChange={(e) => setProfile({
                      ...profile,
                      healthInfo: {...profile.healthInfo, bloodType: e.target.value}
                    })}
                    className="w-full px-3 py-2 bg-[#151C2C] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-white">{profile.healthInfo.bloodType}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Allergies</label>
                {isEditing ? (
                  <textarea
                    value={profile.healthInfo.allergies.join(', ')}
                    onChange={(e) => setProfile({
                      ...profile,
                      healthInfo: {
                        ...profile.healthInfo,
                        allergies: e.target.value.split(',').map(s => s.trim())
                      }
                    })}
                    className="w-full px-3 py-2 bg-[#151C2C] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                    placeholder="Separate with commas"
                    rows={2}
                  />
                ) : (
                  <p className="text-white">{profile.healthInfo.allergies.join(', ') || 'None'}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Current Medications</label>
                {isEditing ? (
                  <textarea
                    value={profile.healthInfo.medications.join(', ')}
                    onChange={(e) => setProfile({
                      ...profile,
                      healthInfo: {
                        ...profile.healthInfo,
                        medications: e.target.value.split(',').map(s => s.trim())
                      }
                    })}
                    className="w-full px-3 py-2 bg-[#151C2C] text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                    placeholder="Separate with commas"
                    rows={2}
                  />
                ) : (
                  <p className="text-white">{profile.healthInfo.medications.join(', ') || 'None'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
