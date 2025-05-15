"use client";

import React, { useState } from 'react';
import {
  Settings,
  Mail,
  Bell,
  Globe,
  Key,
  Database,
  Cloud,
  Tool,
  Server,
  Clock,
  Save,
} from 'lucide-react';

interface EmailSettings {
  smtpServer: string;
  smtpPort: number;
  senderEmail: string;
  enableSSL: boolean;
}

interface NotificationSettings {
  enableEmailNotifications: boolean;
  enablePushNotifications: boolean;
  enableSMSNotifications: boolean;
  adminAlerts: boolean;
}

interface SystemSettings {
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
}

interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  retentionPeriod: number;
  backupLocation: string;
}

export default function SettingsPage() {
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpServer: 'smtp.gymsync.com',
    smtpPort: 587,
    senderEmail: 'noreply@gymsync.com',
    enableSSL: true,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enableEmailNotifications: true,
    enablePushNotifications: true,
    enableSMSNotifications: false,
    adminAlerts: true,
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
    language: 'en',
  });

  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 30,
    backupLocation: 'aws-s3',
  });

  const handleSaveSettings = (settingType: string) => {
    // TODO: Implement settings save functionality
    console.log(`Saving ${settingType} settings...`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure global system settings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Configuration */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Email Configuration</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SMTP Server
              </label>
              <input
                type="text"
                value={emailSettings.smtpServer}
                onChange={(e) => setEmailSettings({ ...emailSettings, smtpServer: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SMTP Port
              </label>
              <input
                type="number"
                value={emailSettings.smtpPort}
                onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sender Email
              </label>
              <input
                type="email"
                value={emailSettings.senderEmail}
                onChange={(e) => setEmailSettings({ ...emailSettings, senderEmail: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={emailSettings.enableSSL}
                onChange={(e) => setEmailSettings({ ...emailSettings, enableSSL: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Enable SSL</label>
            </div>
            <button
              onClick={() => handleSaveSettings('email')}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Email Settings
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</label>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  checked={notificationSettings.enableEmailNotifications}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, enableEmailNotifications: e.target.checked })}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">Push Notifications</label>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  checked={notificationSettings.enablePushNotifications}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, enablePushNotifications: e.target.checked })}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">SMS Notifications</label>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  checked={notificationSettings.enableSMSNotifications}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, enableSMSNotifications: e.target.checked })}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">Admin Alert Notifications</label>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  checked={notificationSettings.adminAlerts}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, adminAlerts: e.target.checked })}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
            <button
              onClick={() => handleSaveSettings('notifications')}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Notification Settings
            </button>
          </div>
        </div>

        {/* System Configuration */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Configuration</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timezone
              </label>
              <select
                value={systemSettings.timezone}
                onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Format
              </label>
              <select
                value={systemSettings.dateFormat}
                onChange={(e) => setSystemSettings({ ...systemSettings, dateFormat: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency
              </label>
              <select
                value={systemSettings.currency}
                onChange={(e) => setSystemSettings({ ...systemSettings, currency: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            <button
              onClick={() => handleSaveSettings('system')}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save System Settings
            </button>
          </div>
        </div>

        {/* Backup & Recovery */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Backup & Recovery</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">Automatic Backup</label>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  checked={backupSettings.autoBackup}
                  onChange={(e) => setBackupSettings({ ...backupSettings, autoBackup: e.target.checked })}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Backup Frequency
              </label>
              <select
                value={backupSettings.backupFrequency}
                onChange={(e) => setBackupSettings({ ...backupSettings, backupFrequency: e.target.value as 'daily' | 'weekly' | 'monthly' })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Retention Period (days)
              </label>
              <input
                type="number"
                value={backupSettings.retentionPeriod}
                onChange={(e) => setBackupSettings({ ...backupSettings, retentionPeriod: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Backup Location
              </label>
              <select
                value={backupSettings.backupLocation}
                onChange={(e) => setBackupSettings({ ...backupSettings, backupLocation: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="aws-s3">AWS S3</option>
                <option value="google-cloud">Google Cloud Storage</option>
                <option value="local">Local Storage</option>
              </select>
            </div>
            <button
              onClick={() => handleSaveSettings('backup')}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Backup Settings
            </button>
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
