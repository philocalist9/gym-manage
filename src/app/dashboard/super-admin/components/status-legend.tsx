"use client";

import React from 'react';

export default function StatusLegend() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Account Status Legend</h3>
      <div className="flex flex-col space-y-2 text-xs">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">Active:</span>
          <span className="text-gray-600 dark:text-gray-400 ml-1">Gym owner can log in.</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">Pending:</span>
          <span className="text-gray-600 dark:text-gray-400 ml-1">Awaiting approval, cannot log in.</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">Inactive:</span>
          <span className="text-gray-600 dark:text-gray-400 ml-1">Account disabled, cannot log in.</span>
        </div>
      </div>
    </div>
  );
}
