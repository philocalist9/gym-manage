"use client";

import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Settings,
  Mail,
  Phone,
  IndianRupee,
  Globe,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';

interface BusinessHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface GymSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    membershipAlerts: boolean;
    paymentReminders: boolean;
    marketingUpdates: boolean;
  };
  privacySettings: {
    showMemberPhotos: boolean;
    showTrainerRatings: boolean;
    publicProfile: boolean;
    shareAnalytics: boolean;
  };
  businessHours: BusinessHours[];
  generalSettings: {
    language: string;
    timezone: string;
    currency: string;
    dateFormat: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<GymSettings>({
    notifications: {
      email: true,
      push: true,
      sms: false,
      membershipAlerts: true,
      paymentReminders: true,
      marketingUpdates: false,
    },
    privacySettings: {
      showMemberPhotos: true,
      showTrainerRatings: true,
      publicProfile: false,
      shareAnalytics: true,
    },
    businessHours: [
      { day: 'Monday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
      { day: 'Tuesday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
      { day: 'Wednesday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
      { day: 'Thursday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
      { day: 'Friday', isOpen: true, openTime: '06:00', closeTime: '22:00' },
      { day: 'Saturday', isOpen: true, openTime: '07:00', closeTime: '20:00' },
      { day: 'Sunday', isOpen: true, openTime: '07:00', closeTime: '20:00' },
    ],
    generalSettings: {
      language: 'en',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
    },
  });

  const handleNotificationChange = (key: keyof GymSettings['notifications']) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  const handlePrivacyChange = (key: keyof GymSettings['privacySettings']) => {
    setSettings({
      ...settings,
      privacySettings: {
        ...settings.privacySettings,
        [key]: !settings.privacySettings[key],
      },
    });
  };

  const handleBusinessHoursChange = (
    index: number,
    field: keyof BusinessHours,
    value: string | boolean
  ) => {
    const newBusinessHours = [...settings.businessHours];
    newBusinessHours[index] = {
      ...newBusinessHours[index],
      [field]: value,
    };
    setSettings({
      ...settings,
      businessHours: newBusinessHours,
    });
  };

  const handleGeneralSettingChange = (
    key: keyof GymSettings['generalSettings'],
    value: string
  ) => {
    setSettings({
      ...settings,
      generalSettings: {
        ...settings.generalSettings,
        [key]: value,
      },
    });
  };

  const saveSettings = () => {
    // TODO: Implement settings save functionality
    console.log('Saving settings:', settings);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your gym settings and preferences</p>
        </div>
        <button
          onClick={saveSettings}
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
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">Email Notifications</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive email updates</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={() => handleNotificationChange('email')}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">Push Notifications</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={() => handleNotificationChange('push')}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">SMS Notifications</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive SMS updates</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.notifications.sms}
                  onChange={() => handleNotificationChange('sms')}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">Membership Alerts</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expiry and renewal notifications</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.notifications.membershipAlerts}
                  onChange={() => handleNotificationChange('membershipAlerts')}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Privacy Settings
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">Show Member Photos</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Display member photos in dashboard</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.privacySettings.showMemberPhotos}
                  onChange={() => handlePrivacyChange('showMemberPhotos')}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">Show Trainer Ratings</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Display trainer ratings publicly</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.privacySettings.showTrainerRatings}
                  onChange={() => handlePrivacyChange('showTrainerRatings')}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900 dark:text-white">Public Profile</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Make gym profile public</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.privacySettings.publicProfile}
                  onChange={() => handlePrivacyChange('publicProfile')}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Business Hours
            </h2>
          </div>
          <div className="space-y-4">
            {settings.businessHours.map((hours, index) => (
              <div key={hours.day} className="flex items-center gap-4">
                <div className="w-24">
                  <span className="text-gray-700 dark:text-gray-300">{hours.day}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hours.isOpen}
                    onChange={(e) => handleBusinessHoursChange(index, 'isOpen', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-600 dark:text-gray-400">Open</label>
                </div>
                <input
                  type="time"
                  value={hours.openTime}
                  onChange={(e) => handleBusinessHoursChange(index, 'openTime', e.target.value)}
                  disabled={!hours.isOpen}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
                <span className="text-gray-600 dark:text-gray-400">to</span>
                <input
                  type="time"
                  value={hours.closeTime}
                  onChange={(e) => handleBusinessHoursChange(index, 'closeTime', e.target.value)}
                  disabled={!hours.isOpen}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
            ))}
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              General Settings
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Language
              </label>
              <select
                value={settings.generalSettings.language}
                onChange={(e) => handleGeneralSettingChange('language', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timezone
              </label>
              <select
                value={settings.generalSettings.timezone}
                onChange={(e) => handleGeneralSettingChange('timezone', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Asia/Kolkata">India (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">New York (EST)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency
              </label>
              <select
                value={settings.generalSettings.currency}
                onChange={(e) => handleGeneralSettingChange('currency', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">Indian Rupee (₹)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Format
              </label>
              <select
                value={settings.generalSettings.dateFormat}
                onChange={(e) => handleGeneralSettingChange('dateFormat', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
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
