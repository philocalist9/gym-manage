"use client";

import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Settings,
  Calendar,
  Users,
  MessageSquare,
  CheckCircle,
  DollarSign
} from 'lucide-react';

interface TrainerSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    clientRequests: boolean;
    sessionReminders: boolean;
    progressUpdates: boolean;
  };
  availability: {
    workingDays: string[];
    timeSlots: {
      day: string;
      slots: {
        start: string;
        end: string;
      }[];
    }[];
    maxClientsPerDay: number;
    bufferBetweenSessions: number;
  };
  sessionPreferences: {
    defaultSessionDuration: number;
    autoAcceptBookings: boolean;
    allowRescheduling: boolean;
    cancellationPeriod: number;
  };
  communicationPreferences: {
    preferredContactMethod: 'email' | 'phone' | 'app';
    autoResponseEnabled: boolean;
    responseDelay: number;
  };
  paymentSettings: {
    hourlyRate: number;
    currency: string;
    acceptPartialPayments: boolean;
    minimumBookingHours: number;
  };
}

export default function TrainerSettingsPage() {
  const [settings, setSettings] = useState<TrainerSettings>({
    notifications: {
      email: true,
      push: true,
      sms: false,
      clientRequests: true,
      sessionReminders: true,
      progressUpdates: true
    },
    availability: {
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: [
        {
          day: 'Monday',
          slots: [
            { start: '06:00', end: '11:00' },
            { start: '16:00', end: '20:00' }
          ]
        },
        {
          day: 'Tuesday',
          slots: [
            { start: '06:00', end: '11:00' },
            { start: '16:00', end: '20:00' }
          ]
        },
        {
          day: 'Wednesday',
          slots: [
            { start: '06:00', end: '11:00' },
            { start: '16:00', end: '20:00' }
          ]
        },
        {
          day: 'Thursday',
          slots: [
            { start: '06:00', end: '11:00' },
            { start: '16:00', end: '20:00' }
          ]
        },
        {
          day: 'Friday',
          slots: [
            { start: '06:00', end: '11:00' },
            { start: '16:00', end: '20:00' }
          ]
        },
        {
          day: 'Saturday',
          slots: [
            { start: '08:00', end: '12:00' }
          ]
        }
      ],
      maxClientsPerDay: 8,
      bufferBetweenSessions: 15
    },
    sessionPreferences: {
      defaultSessionDuration: 60,
      autoAcceptBookings: false,
      allowRescheduling: true,
      cancellationPeriod: 24
    },
    communicationPreferences: {
      preferredContactMethod: 'app',
      autoResponseEnabled: true,
      responseDelay: 30
    },
    paymentSettings: {
      hourlyRate: 1500,
      currency: 'INR',
      acceptPartialPayments: false,
      minimumBookingHours: 1
    }
  });

  const handleNotificationChange = (key: keyof TrainerSettings['notifications']) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  const handleSaveSettings = () => {
    // TODO: Implement settings save functionality
    console.log('Saving settings:', settings);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your preferences and training settings</p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notification Settings
            </h2>
          </div>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900 dark:text-white capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive {key.replace(/([A-Z])/g, ' $1').toLowerCase()} notifications
                  </p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleNotificationChange(key as keyof TrainerSettings['notifications'])}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Session Preferences
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Session Duration (minutes)
              </label>
              <select
                value={settings.sessionPreferences.defaultSessionDuration}
                onChange={(e) => setSettings({
                  ...settings,
                  sessionPreferences: {
                    ...settings.sessionPreferences,
                    defaultSessionDuration: parseInt(e.target.value)
                  }
                })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cancellation Period (hours)
              </label>
              <select
                value={settings.sessionPreferences.cancellationPeriod}
                onChange={(e) => setSettings({
                  ...settings,
                  sessionPreferences: {
                    ...settings.sessionPreferences,
                    cancellationPeriod: parseInt(e.target.value)
                  }
                })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={12}>12 hours</option>
                <option value={24}>24 hours</option>
                <option value={48}>48 hours</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">Auto-accept Bookings</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Automatically accept new session bookings
                </p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.sessionPreferences.autoAcceptBookings}
                  onChange={() => setSettings({
                    ...settings,
                    sessionPreferences: {
                      ...settings.sessionPreferences,
                      autoAcceptBookings: !settings.sessionPreferences.autoAcceptBookings
                    }
                  })}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Payment Settings
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hourly Rate (₹)
              </label>
              <input
                type="number"
                value={settings.paymentSettings.hourlyRate}
                onChange={(e) => setSettings({
                  ...settings,
                  paymentSettings: {
                    ...settings.paymentSettings,
                    hourlyRate: parseInt(e.target.value)
                  }
                })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minimum Booking Hours
              </label>
              <select
                value={settings.paymentSettings.minimumBookingHours}
                onChange={(e) => setSettings({
                  ...settings,
                  paymentSettings: {
                    ...settings.paymentSettings,
                    minimumBookingHours: parseInt(e.target.value)
                  }
                })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={1}>1 hour</option>
                <option value={2}>2 hours</option>
                <option value={5}>5 hours</option>
                <option value={10}>10 hours</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">Accept Partial Payments</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Allow clients to pay in installments
                </p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.paymentSettings.acceptPartialPayments}
                  onChange={() => setSettings({
                    ...settings,
                    paymentSettings: {
                      ...settings.paymentSettings,
                      acceptPartialPayments: !settings.paymentSettings.acceptPartialPayments
                    }
                  })}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Communication Preferences
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preferred Contact Method
              </label>
              <select
                value={settings.communicationPreferences.preferredContactMethod}
                onChange={(e) => setSettings({
                  ...settings,
                  communicationPreferences: {
                    ...settings.communicationPreferences,
                    preferredContactMethod: e.target.value as 'email' | 'phone' | 'app'
                  }
                })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="app">In-App Message</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Response Delay (minutes)
              </label>
              <select
                value={settings.communicationPreferences.responseDelay}
                onChange={(e) => setSettings({
                  ...settings,
                  communicationPreferences: {
                    ...settings.communicationPreferences,
                    responseDelay: parseInt(e.target.value)
                  }
                })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">Auto-Response</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Send automatic response to new messages
                </p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.communicationPreferences.autoResponseEnabled}
                  onChange={() => setSettings({
                    ...settings,
                    communicationPreferences: {
                      ...settings.communicationPreferences,
                      autoResponseEnabled: !settings.communicationPreferences.autoResponseEnabled
                    }
                  })}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .toggle-checkbox:checked {
          @apply right-0 border-blue-600;
        }
        .toggle-checkbox:checked + .toggle-label {
          @apply bg-blue-600;
        }
      `}</style>
    </div>
  );
}
