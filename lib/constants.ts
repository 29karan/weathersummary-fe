// Region metadata and constants

import { RegionInfo, UKRegion } from '@/types/weather';

export const UK_REGIONS: Record<UKRegion, RegionInfo> = {
  england_n: {
    id: 'england_n',
    name: 'Northern England',
    shortName: 'England N',
    coordinates: [-2.0, 54.5],
  },
  england_s: {
    id: 'england_s',
    name: 'Southern England',
    shortName: 'England S',
    coordinates: [-1.0, 51.0],
  },
  england_e_ne: {
    id: 'england_e_ne',
    name: 'Eastern & North Eastern England',
    shortName: 'England E & NE',
    coordinates: [0.5, 53.0],
  },
  england_central: {
    id: 'england_central',
    name: 'Central England',
    shortName: 'England Central',
    coordinates: [-1.5, 52.5],
  },
  england_sw_s_wales: {
    id: 'england_sw_s_wales',
    name: 'South West England & South Wales',
    shortName: 'England SW & S Wales',
    coordinates: [-3.5, 51.0],
  },
  midlands: {
    id: 'midlands',
    name: 'Midlands',
    shortName: 'Midlands',
    coordinates: [-1.8, 52.8],
  },
  east_anglia: {
    id: 'east_anglia',
    name: 'East Anglia',
    shortName: 'East Anglia',
    coordinates: [0.8, 52.5],
  },
  scotland_n: {
    id: 'scotland_n',
    name: 'Northern Scotland',
    shortName: 'Scotland N',
    coordinates: [-4.0, 57.5],
  },
  scotland_e: {
    id: 'scotland_e',
    name: 'Eastern Scotland',
    shortName: 'Scotland E',
    coordinates: [-3.0, 56.5],
  },
  scotland_w: {
    id: 'scotland_w',
    name: 'Western Scotland',
    shortName: 'Scotland W',
    coordinates: [-5.0, 56.0],
  },
  wales_n: {
    id: 'wales_n',
    name: 'Northern Wales',
    shortName: 'Wales N',
    coordinates: [-3.8, 53.0],
  },
  wales: {
    id: 'wales',
    name: 'Wales',
    shortName: 'Wales',
    coordinates: [-3.5, 52.0],
  },
  northern_ireland: {
    id: 'northern_ireland',
    name: 'Northern Ireland',
    shortName: 'N. Ireland',
    coordinates: [-6.5, 54.7],
  },
  uk: {
    id: 'uk',
    name: 'United Kingdom',
    shortName: 'UK',
    coordinates: [-2.0, 54.0],
  },
};

export const METRIC_INFO = {
  temperature_min: {
    label: 'Min Temperature',
    unit: '°C',
    color: 'var(--temp-cold)',
    icon: '🌡️',
  },
  temperature_max: {
    label: 'Max Temperature',
    unit: '°C',
    color: 'var(--temp-hot)',
    icon: '🌡️',
  },
  temperature_mean: {
    label: 'Mean Temperature',
    unit: '°C',
    color: 'var(--temp-mild)',
    icon: '🌡️',
  },
  frost_days: {
    label: 'Frost Days',
    unit: 'days',
    color: 'var(--temp-freezing)',
    icon: '❄️',
  },
  rainfall: {
    label: 'Rainfall',
    unit: 'mm',
    color: 'var(--rain-heavy)',
    icon: '🌧️',
  },
  rain_days: {
    label: 'Rain Days',
    unit: 'days',
    color: 'var(--rain-moderate)',
    icon: '☔',
  },
  sunshine: {
    label: 'Sunshine',
    unit: 'hours',
    color: 'var(--chart-4)',
    icon: '☀️',
  },
};

export const MONTHS = [
  { id: 'jan', name: 'January', short: 'Jan' },
  { id: 'feb', name: 'February', short: 'Feb' },
  { id: 'mar', name: 'March', short: 'Mar' },
  { id: 'apr', name: 'April', short: 'Apr' },
  { id: 'may', name: 'May', short: 'May' },
  { id: 'jun', name: 'June', short: 'Jun' },
  { id: 'jul', name: 'July', short: 'Jul' },
  { id: 'aug', name: 'August', short: 'Aug' },
  { id: 'sep', name: 'September', short: 'Sep' },
  { id: 'oct', name: 'October', short: 'Oct' },
  { id: 'nov', name: 'November', short: 'Nov' },
  { id: 'dec', name: 'December', short: 'Dec' },
] as const;

export const SEASONS = [
  { id: 'winter', name: 'Winter', months: ['dec', 'jan', 'feb'] },
  { id: 'spring', name: 'Spring', months: ['mar', 'apr', 'may'] },
  { id: 'summer', name: 'Summer', months: ['jun', 'jul', 'aug'] },
  { id: 'autumn', name: 'Autumn', months: ['sep', 'oct', 'nov'] },
] as const;
