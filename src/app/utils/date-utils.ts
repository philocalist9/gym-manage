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

// Check if payment is due within a specific number of days (default: 7 days)
export const isPaymentDueSoon = (dateString: string, daysThreshold = 7) => {
  const paymentDate = new Date(dateString);
  const currentDate = new Date();
  
  // Set hours to 0 for date comparison
  paymentDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  const differenceInTime = paymentDate.getTime() - currentDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
  return differenceInDays >= 0 && differenceInDays <= daysThreshold;
};

// Check if payment date has passed
export const isPastDuePayment = (dateString: string) => {
  const paymentDate = new Date(dateString);
  const currentDate = new Date();
  
  // Set hours to 0 for date comparison
  paymentDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  return paymentDate < currentDate;
};

// Get days remaining until a given date
export const getDaysUntil = (dateString: string): number => {
  const targetDate = new Date(dateString);
  const currentDate = new Date();
  
  // Set hours to 0 for date comparison
  targetDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  const differenceInTime = targetDate.getTime() - currentDate.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  
  return differenceInDays;
};

// Get payment status with more detail
export const getPaymentStatus = (dateString: string): {
  status: 'overdue' | 'due-soon' | 'upcoming';
  daysOverdue?: number;
  daysUntil?: number;
} => {
  if (isPastDuePayment(dateString)) {
    return {
      status: 'overdue',
      daysOverdue: Math.abs(getDaysUntil(dateString))
    };
  }
  
  if (isPaymentDueSoon(dateString)) {
    return {
      status: 'due-soon',
      daysUntil: getDaysUntil(dateString)
    };
  }
  
  return {
    status: 'upcoming',
    daysUntil: getDaysUntil(dateString)
  };
};
