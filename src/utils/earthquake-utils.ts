import { date } from 'quasar';

export const getMagnitudeColor = (magnitude: number): string => {
  if (magnitude >= 7) return 'red';
  if (magnitude >= 5) return 'orange';
  if (magnitude >= 3) return 'yellow';
  return 'green';
};

export const getMagnitudeColorRgba = (magnitude: number): string => {
  if (magnitude >= 7) return 'rgba(244, 67, 54, 0.8)';
  if (magnitude >= 5) return 'rgba(255, 152, 0, 0.8)';
  if (magnitude >= 3) return 'rgba(255, 235, 59, 0.8)';
  return 'rgba(76, 175, 80, 0.8)';
};

export const getMarkerRadius = (magnitude: number): number => {
  return Math.max(4, magnitude * 3);
};

export const formatTime = (timestamp: number): string => {
  return date.formatDate(timestamp, 'MMM DD, YYYY HH:mm');
};

export const formatTimeDetailed = (timestamp: number): string => {
  return date.formatDate(timestamp, 'MMM DD, YYYY HH:mm:ss');
};