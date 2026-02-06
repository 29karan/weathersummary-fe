// Data filtering and transformation utilities for tables view

import type { AnnualWeatherData, FilterState, UKRegion } from '@/types/weather';

import { UK_REGIONS } from './constants';

export interface TableRow {
  id: string;
  year: number;
  region: UKRegion;
  regionName: string;
  temperatureMin: number;
  temperatureMax: number;
  temperatureMean: number;
  rainfall: number;
  rainDays: number;
  sunshine: number;
  frostDays: number;
  [key: string]: string | number | UKRegion;
}

export interface SummaryStatistics {
  totalRecords: number;
  dateRange: { start: number; end: number };
  regions: string[];
  averages: {
    temperatureMean: number;
    rainfall: number;
    sunshine: number;
  };
  extremes: {
    hottestYear: { year: number; region: string; value: number };
    coldestYear: { year: number; region: string; value: number };
    wettestYear: { year: number; region: string; value: number };
    driestYear: { year: number; region: string; value: number };
  };
}

// Transform annual data to table rows
export function transformToTableRows(data: AnnualWeatherData[]): TableRow[] {
  return data.map((item) => ({
    id: `${item.region}-${item.year}`,
    year: item.year,
    region: item.region,
    regionName: UK_REGIONS[item.region].name,
    temperatureMin: Number(item.temperature_min.annual.toFixed(1)),
    temperatureMax: Number(item.temperature_max.annual.toFixed(1)),
    temperatureMean: Number(item.temperature_mean.annual.toFixed(1)),
    rainfall: Number(item.rainfall.annual.toFixed(0)),
    rainDays: Number(item.rain_days.annual.toFixed(0)),
    sunshine: Number(item.sunshine.annual.toFixed(0)),
    frostDays: Number(item.frost_days.annual.toFixed(0)),
  }));
}

// Apply filters to data
export function filterTableData(
  data: TableRow[],
  filters: FilterState
): TableRow[] {
  return data.filter((row) => {
    // Filter by regions
    if (filters.regions.length > 0 && !filters.regions.includes(row.region)) {
      return false;
    }

    // Filter by year range
    if (
      row.year < filters.yearRange.start ||
      row.year > filters.yearRange.end
    ) {
      return false;
    }

    return true;
  });
}

// Calculate summary statistics
export function calculateSummaryStats(data: TableRow[]): SummaryStatistics {
  if (data.length === 0) {
    return {
      totalRecords: 0,
      dateRange: { start: 0, end: 0 },
      regions: [],
      averages: { temperatureMean: 0, rainfall: 0, sunshine: 0 },
      extremes: {
        hottestYear: { year: 0, region: '', value: 0 },
        coldestYear: { year: 0, region: '', value: 0 },
        wettestYear: { year: 0, region: '', value: 0 },
        driestYear: { year: 0, region: '', value: 0 },
      },
    };
  }

  const years = data.map((d) => d.year);
  const uniqueRegions = [...new Set(data.map((d) => d.regionName))];

  // Calculate averages
  const avgTemp =
    data.reduce((sum, d) => sum + d.temperatureMean, 0) / data.length;
  const avgRainfall =
    data.reduce((sum, d) => sum + d.rainfall, 0) / data.length;
  const avgSunshine =
    data.reduce((sum, d) => sum + d.sunshine, 0) / data.length;

  // Find extremes
  const hottestYear = data.reduce((max, d) =>
    d.temperatureMean > max.temperatureMean ? d : max
  );
  const coldestYear = data.reduce((min, d) =>
    d.temperatureMean < min.temperatureMean ? d : min
  );
  const wettestYear = data.reduce((max, d) =>
    d.rainfall > max.rainfall ? d : max
  );
  const driestYear = data.reduce((min, d) =>
    d.rainfall < min.rainfall ? d : min
  );

  return {
    totalRecords: data.length,
    dateRange: {
      start: Math.min(...years),
      end: Math.max(...years),
    },
    regions: uniqueRegions,
    averages: {
      temperatureMean: Number(avgTemp.toFixed(1)),
      rainfall: Number(avgRainfall.toFixed(0)),
      sunshine: Number(avgSunshine.toFixed(0)),
    },
    extremes: {
      hottestYear: {
        year: hottestYear.year,
        region: hottestYear.regionName,
        value: hottestYear.temperatureMean,
      },
      coldestYear: {
        year: coldestYear.year,
        region: coldestYear.regionName,
        value: coldestYear.temperatureMean,
      },
      wettestYear: {
        year: wettestYear.year,
        region: wettestYear.regionName,
        value: wettestYear.rainfall,
      },
      driestYear: {
        year: driestYear.year,
        region: driestYear.regionName,
        value: driestYear.rainfall,
      },
    },
  };
}

// Get temperature color based on value
export function getTemperatureColor(temp: number): string {
  // Blue (cold) to Red (hot) gradient
  if (temp < 5) return '#3b82f6'; // blue-500
  if (temp < 8) return '#60a5fa'; // blue-400
  if (temp < 10) return '#93c5fd'; // blue-300
  if (temp < 12) return '#fbbf24'; // amber-400
  if (temp < 14) return '#f59e0b'; // amber-500
  return '#ef4444'; // red-500
}

// Get rainfall color based on value
export function getRainfallColor(rainfall: number): string {
  // Light to dark blue based on intensity
  if (rainfall < 600) return '#dbeafe'; // blue-100
  if (rainfall < 800) return '#bfdbfe'; // blue-200
  if (rainfall < 1000) return '#93c5fd'; // blue-300
  if (rainfall < 1200) return '#60a5fa'; // blue-400
  return '#3b82f6'; // blue-500
}
