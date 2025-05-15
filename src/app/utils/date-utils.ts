"use client";

export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options
  });
};

export const formatTime = (time: Date | string) => {
  if (typeof time === 'string' && time.includes(':')) {
    return time; // Already formatted time string
  }
  const date = typeof time === 'string' ? new Date(time) : time;
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDateTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return {
    date: formatDate(dateObj),
    time: formatTime(dateObj)
  };
};
