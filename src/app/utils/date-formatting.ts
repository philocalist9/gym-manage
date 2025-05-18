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
