// Data transformation and filtering utilities
// These functions prepare data for different visualization modes

import {
  AnnualWeatherData,
  MetricType,
  Month,
  Season,
  UKRegion,
  TimeSeriesDataPoint,
  ComparisonDataPoint,
  HeatmapDataPoint,
  TableRow,
} from '@/types/weather';
import { METRIC_INFO, UK_REGIONS, MONTHS } from './constants';

// ============================================
// FILTERING FUNCTIONS
// ============================================

export function filterDataByRegions(
  data: AnnualWeatherData[],
  regions: UKRegion[]
): AnnualWeatherData[] {
  if (regions.length === 0) return data;
  return data.filter((d) => regions.includes(d.region));
}

export function filterDataByYearRange(
  data: AnnualWeatherData[],
  startYear: number,
  endYear: number
): AnnualWeatherData[] {
  return data.filter((d) => d.year >= startYear && d.year <= endYear);
}

// ============================================
// DATA EXTRACTION
// ============================================

export function extractMetricValue(
  data: AnnualWeatherData,
  metric: MetricType | 'temperature_range',
  period: 'annual' | Month | Season
): number {
  if (metric === 'temperature_range') {
    const min = data.temperature_min[period];
    const max = data.temperature_max[period];
    return max - min;
  }
  
  const metricData = data[metric];
  return metricData[period];
}

export function getMonthlyValues(
  data: AnnualWeatherData,
  metric: MetricType
): number[] {
  const metricData = data[metric];
  return MONTHS.map((m) => metricData[m.id as Month]);
}

// ============================================
// TIME SERIES TRANSFORMATIONS
// ============================================

export function transformToTimeSeries(
  data: AnnualWeatherData[],
  metric: MetricType,
  period: 'annual' | Month | Season = 'annual'
): TimeSeriesDataPoint[] {
  return data.map((d) => ({
    date: d.year.toString(),
    value: extractMetricValue(d, metric, period),
    region: UK_REGIONS[d.region].shortName,
    metric: METRIC_INFO[metric].label,
  }));
}

export function transformToMultiRegionTimeSeries(
  data: AnnualWeatherData[],
  metric: MetricType,
  regions: UKRegion[],
  period: 'annual' | Month | Season = 'annual'
): Record<string, TimeSeriesDataPoint[]> {
  const result: Record<string, TimeSeriesDataPoint[]> = {};
  
  regions.forEach((region) => {
    const regionData = data.filter((d) => d.region === region);
    result[region] = transformToTimeSeries(regionData, metric, period);
  });
  
  return result;
}

// ============================================
// COMPARISON TRANSFORMATIONS
// ============================================

export function transformToRegionalComparison(
  data: AnnualWeatherData[],
  year: number,
  metrics: MetricType[],
  period: 'annual' | Month | Season = 'annual'
): ComparisonDataPoint[] {
  const yearData = data.filter((d) => d.year === year);
  
  return yearData.map((d) => {
    const point: ComparisonDataPoint = {
      category: UK_REGIONS[d.region].shortName,
    };
    
    metrics.forEach((metric) => {
      point[metric] = extractMetricValue(d, metric, period);
    });
    
    return point;
  });
}

export function transformToMonthlyComparison(
  data: AnnualWeatherData,
  metric: MetricType
): ComparisonDataPoint[] {
  return MONTHS.map((month) => ({
    category: month.short,
    value: extractMetricValue(data, metric, month.id as Month),
  }));
}

// ============================================
// HEATMAP TRANSFORMATIONS
// ============================================

export function transformToHeatmap(
  data: AnnualWeatherData[],
  metric: MetricType,
  region: UKRegion
): HeatmapDataPoint[] {
  const regionData = data.filter((d) => d.region === region);
  const heatmapData: HeatmapDataPoint[] = [];
  
  regionData.forEach((yearData) => {
    MONTHS.forEach((month) => {
      heatmapData.push({
        year: yearData.year,
        month: month.id as Month,
        value: extractMetricValue(yearData, metric, month.id as Month),
      });
    });
  });
  
  return heatmapData;
}

// ============================================
// TABLE TRANSFORMATIONS
// ============================================

export function transformToTableRows(
  data: AnnualWeatherData[],
  includeMonthly: boolean = false
): TableRow[] {
  return data.map((d) => {
    const row: TableRow = {
      id: `${d.region}-${d.year}`,
      year: d.year,
      region: UK_REGIONS[d.region].shortName,
      temp_min: d.temperature_min.annual.toFixed(1),
      temp_max: d.temperature_max.annual.toFixed(1),
      temp_mean: d.temperature_mean.annual.toFixed(1),
      frost_days: Math.round(d.frost_days.annual),
      rainfall: Math.round(d.rainfall.annual),
      rain_days: Math.round(d.rain_days.annual),
      sunshine: Math.round(d.sunshine.annual),
    };
    
    if (includeMonthly) {
      MONTHS.forEach((month) => {
        row[`temp_${month.id}`] = d.temperature_mean[month.id as Month].toFixed(1);
        row[`rain_${month.id}`] = Math.round(d.rainfall[month.id as Month]);
      });
    }
    
    return row;
  });
}

// ============================================
// STATISTICS CALCULATIONS
// ============================================

export function calculateAverage(values: number[]): number {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

export function calculateMin(values: number[]): number {
  return Math.min(...values);
}

export function calculateMax(values: number[]): number {
  return Math.max(...values);
}

export function calculateTrend(values: number[]): {
  direction: 'increasing' | 'decreasing' | 'stable';
  percentage: number;
} {
  if (values.length < 2) {
    return { direction: 'stable', percentage: 0 };
  }
  
  const first = values[0];
  const last = values[values.length - 1];
  const change = ((last - first) / first) * 100;
  
  if (Math.abs(change) < 2) {
    return { direction: 'stable', percentage: 0 };
  }
  
  return {
    direction: change > 0 ? 'increasing' : 'decreasing',
    percentage: Math.abs(change),
  };
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

export function exportToCSV(data: TableRow[], filename: string): void {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) => headers.map((h) => row[h]).join(',')),
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(data: unknown[], filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
