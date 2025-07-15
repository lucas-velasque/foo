// src/shared/utils/helpers.ts
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Example: Function to calculate total service credit value (if needed)
export const calculateWorkCreditValue = (hours: number, ratePerHour: number): number => {
  return hours * ratePerHour;
};