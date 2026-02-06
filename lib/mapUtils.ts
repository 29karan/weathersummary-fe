// Map utilities for color scales, data transformations, and region lookups

import { scaleLinear } from 'd3-scale';
import type { UKRegion, MetricType, AnnualWeatherData } from '@/types/weather';
import { MOCK_WEATHER_DATA } from './mockWeatherData';

export interface RegionMapData {
  region: UKRegion;
  regionName: string;
  value: number;
  color: string;
  rank: number;
}

// Color scale generators for different metrics
// Get metric info
export function getMetricInfo(metric: MetricType | 'temperature_range'): { name: string; unit: string } {
  const metricMap: Record<string, { name: string; unit: string }> = {
    temperature_mean: { name: 'Mean Temperature', unit: '°C' },
    temperature_min: { name: 'Min Temperature', unit: '°C' },
    temperature_max: { name: 'Max Temperature', unit: '°C' },
    temperature_range: { name: 'Temperature Range', unit: '°C' },
    rainfall: { name: 'Rainfall', unit: 'mm' },
    sunshine: { name: 'Sunshine', unit: 'hrs' },
    frost_days: { name: 'Frost Days', unit: 'days' },
    rain_days: { name: 'Rain Days', unit: 'days' },
  };

  return metricMap[metric] || { name: metric, unit: '' };
}

// Helper to get metric values (both direct and derived)
export function getMetricValue(data: AnnualWeatherData, metric: MetricType): number | null {
  if (metric === 'temperature_range') {
    const min = data.temperature_min?.annual;
    const max = data.temperature_max?.annual;
    if (min !== undefined && max !== undefined) {
      return max - min;
    }
    return null;
  }
  
  // Standard metric
  return data[metric]?.annual ?? null;
}

// Updated color scale for derived metrics
export function getColorScale(metric: MetricType | 'temperature_range', min: number, max: number) {
  switch (metric) {
    case 'temperature_mean':
    case 'temperature_min':
    case 'temperature_max':
      return scaleLinear<string>()
        .domain([min, max])
        .range(['#3b82f6', '#ef4444']);
    
    case 'temperature_range':
      // Green (stable) to Purple (volatile)
      return scaleLinear<string>()
        .domain([min, max])
        .range(['#22c55e', '#a855f7']);

    case 'rainfall':
      return scaleLinear<string>()
        .domain([min, max])
        .range(['#dbeafe', '#1e40af']);

    case 'sunshine':
      return scaleLinear<string>()
        .domain([min, max])
        .range(['#fef08a', '#f97316']);

    case 'frost_days':
      return scaleLinear<string>()
        .domain([min, max])
        .range(['#f0f9ff', '#1e3a8a']);

    case 'rain_days':
      return scaleLinear<string>()
        .domain([min, max])
        .range(['#cffafe', '#0e7490']);

    default:
      return scaleLinear<string>()
        .domain([min, max])
        .range(['#e5e7eb', '#374151']);
  }
}

// Updated to handle derived metrics
export function getAllRegionValues(
  year: number,
  metric: MetricType
): Map<UKRegion, number> {
  const values = new Map<UKRegion, number>();

  MOCK_WEATHER_DATA.filter((d) => d.year === year).forEach((data) => {
    let value: number | undefined;

    if (metric === 'temperature_range') {
      const val = getMetricValue(data, metric);
      if (val !== null) value = val;
    } else {
      value = data[metric]?.annual;
    }

    if (value !== undefined) {
      values.set(data.region, value);
    }
  });

  return values;
}

// Updated Map Data getter
export function getMapData(
  year: number,
  metric: MetricType | 'temperature_range'
): RegionMapData[] {
  const regionValues = getAllRegionValues(year, metric);
  const values = Array.from(regionValues.values());

  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const colorScale = getColorScale(metric, min, max);

  const sorted = Array.from(regionValues.entries()).sort(
    ([, a], [, b]) => b - a
  );

  const rankMap = new Map<UKRegion, number>();
  sorted.forEach(([region], index) => {
    rankMap.set(region, index + 1);
  });

  return Array.from(regionValues.entries()).map(([region, value]) => ({
    region,
    regionName: region.replace(/_/g, ' ').toUpperCase(),
    value: Number(value.toFixed(1)),
    color: colorScale(value),
    rank: rankMap.get(region) || 0,
  }));
}

// Updated Range getter
export function getMetricRange(
  year: number,
  metric: MetricType | 'temperature_range'
): { min: number; max: number } {
  const values = Array.from(getAllRegionValues(year, metric).values());

  if (values.length === 0) {
    return { min: 0, max: 0 };
  }

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}
