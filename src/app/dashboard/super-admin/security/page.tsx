"use client";

import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  UserCheck,
  Lock,
  Eye,
  AlertCircle,
  Clock,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'password_change' | 'permission_change' | 'account_lockout';
  status: 'success' | 'failed';
  user: string;
  timestamp: string;
  location: string;
  ipAddress: string;
}

interface SecurityMetrics {
  failedLogins: number;
  accountLockouts: number;
  activeAdmins: number;
  mfaEnabled: number;
  incidentRate: number;
  avgResponseTime: number;
}

export default function SecurityPage() {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    failedLogins: 23,
    accountLockouts: 5,
    activeAdmins: 8,
    mfaEnabled: 92,
    incidentRate: -15,
    avgResponseTime: 45,
  });

  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'login_attempt',
      status: 'failed',
      user: 'john.doe@example.com',
      timestamp: '2025-05-15T09:23:15',
      location: 'Mumbai, India',
      ipAddress: '192.168.1.1',
    },
    {
      id: '2',
      type: 'permission_change',
      status: 'success',
      user: 'admin@gymsync.com',
      timestamp: '2025-05-15T09:20:00',
      location: 'Delhi, India',
      ipAddress: '192.168.1.2',
    },
    {
      id: '3',
      type: 'password_change',
      status: 'success',
      user: 'trainer@gymsync.com',
      timestamp: '2025-05-15T09:15:30',
      location: 'Bangalore, India',
      ipAddress: '192.168.1.3',
    },
    {
      id: '4',
      type: 'account_lockout',
      status: 'failed',
      user: 'jane.smith@example.com',
      timestamp: '2025-05-15T09:10:00',
      location: 'Chennai, India',
      ipAddress: '192.168.1.4',
    },
  ]);

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'login_attempt':
        return <UserCheck className="w-5 h-5" />;
      case 'password_change':
        return <Lock className="w-5 h-5" />;
      case 'permission_change':
        return <Shield className="w-5 h-5" />;
      case 'account_lockout':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Eye className="w-5 h-5" />;
    }
  };

  const getEventTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Security & Access Control</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor system security and manage access controls</p>
      </div>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Failed Login Attempts</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {securityMetrics.failedLogins}
              </h3>
            </div>
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600 dark:text-green-400">
            <ArrowDownRight className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">12% decrease</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">MFA Enabled Users</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {securityMetrics.mfaEnabled}%
              </h3>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Incident Rate</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {Math.abs(securityMetrics.incidentRate)}% 
                <span className="text-sm text-green-600 dark:text-green-400 ml-1">decrease</span>
              </h3>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow mt-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Security Events</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                          {getEventTypeIcon(event.type)}
                        </span>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {getEventTypeLabel(event.type)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {event.ipAddress}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {event.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {event.status === 'success' ? (
                        <span className="flex items-center text-green-600 dark:text-green-400">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Success
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 dark:text-red-400">
                          <XCircle className="w-4 h-4 mr-1" />
                          Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Access Control Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Require 2FA for all admin accounts</p>
              </div>
              <div className="flex items-center">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Configure
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Session Management</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage active user sessions</p>
              </div>
              <div className="flex items-center">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View Sessions
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">IP Whitelisting</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage allowed IP addresses</p>
              </div>
              <div className="flex items-center">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Manage
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">SSL Certificate</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Valid until June 15, 2025</p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Data Backup</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last backup: 2 hours ago</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Run Backup
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">System Updates</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">All systems up to date</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Check Updates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
