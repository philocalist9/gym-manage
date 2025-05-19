"use client";

/**
 * Utility functions for consistent date formatting across the application
 * Using these functions helps prevent hydration errors caused by date formatting mismatches
 * between server and client rendering
 */

/**
 * Format a date with a consistent locale for both server and client
 * @param date Date to format
 * @param options Formatting options
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, options: Intl.DateTimeFormatOptions = {}): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return typeof date === 'string' ? date : 'Invalid Date';
  }
  
  // Always use 'en-US' locale for consistency between server and client
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options
  });
}

/**
 * Format a date in short format (MM/DD/YYYY)
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatShortDate(date: Date | string): string {
  return formatDate(date, {
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit'
  });
}

/**
 * Format a date with month name (Jan 15, 2025)
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatMonthNameDate(date: Date | string): string {
  return formatDate(date, {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
}

/**
 * Format a date for a chart axis (Jan 15)
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatChartDate(date: Date | string): string {
  return formatDate(date, {
    month: 'short', 
    day: 'numeric'
  });
}

/**
 * Format time from a Date object or time string
 * @param time Time to format
 * @returns Formatted time string (12-hour format with AM/PM)
 */
export function formatTime(time: Date | string): string {
  if (typeof time === 'string' && time.includes(':')) {
    return time; // Already formatted time string
  }
  
  const date = typeof time === 'string' ? new Date(time) : time;
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return typeof time === 'string' ? time : 'Invalid Time';
  }
  
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format a date and time together
 * @param date Date to format
 * @returns Object with formatted date and time
 */
export function formatDateTime(date: Date | string): { date: string; time: string } {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return {
      date: typeof date === 'string' ? date : 'Invalid Date',
      time: typeof date === 'string' ? date : 'Invalid Time'
    };
  }
  
  return {
    date: formatDate(dateObj),
    time: formatTime(dateObj)
  };
}
