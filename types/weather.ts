// Extended Weather Data Type Definitions

// ============================================
// CORE DATA STRUCTURES
// ============================================

export type MetricType = 
  | 'temperature_min'
  | 'temperature_max'
  | 'temperature_mean'
  // | 'temperature_range'
  | 'frost_days'
  | 'rainfall'
  | 'rain_days'
  | 'sunshine';

export type Month = 
  | 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun'
  | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec';

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export type UKRegion =
  | 'england_n'
  | 'england_s'
  | 'england_e_ne'
  | 'england_central'
  | 'england_sw_s_wales'
  | 'midlands'
  | 'east_anglia'
  | 'scotland_n'
  | 'scotland_e'
  | 'scotland_w'
  | 'wales_n'
  | 'wales'
  | 'northern_ireland'
  | 'uk';

export interface RegionInfo {
  id: UKRegion;
  name: string;
  shortName: string;
  coordinates: [number, number]; // [longitude, latitude]
}

// ============================================
// MONTHLY & SEASONAL DATA
// ============================================

export interface MonthlyData {
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
}

export interface SeasonalData {
  winter: number;  // Dec-Feb
  spring: number;  // Mar-May
  summer: number;  // Jun-Aug
  autumn: number;  // Sep-Nov
}

// Combined type for metric data (monthly + seasonal + annual)
export interface MetricData extends MonthlyData, SeasonalData {
  annual: number;
}

export interface AnnualWeatherData {
  year: number;
  region: UKRegion;
  
  // Temperature (°C)
  temperature_min: MetricData;
  temperature_max: MetricData;
  temperature_mean: MetricData;
  
  // Frost days (count)
  frost_days: MetricData;
  
  // Rainfall (mm)
  rainfall: MetricData;
  
  // Rain days (count)
  rain_days: MetricData;
  
  // Sunshine (hours)
  sunshine: MetricData;
}

// ============================================
// FILTER TYPES
// ============================================

export interface FilterState {
  regions: UKRegion[];
  yearRange: {
    start: number;
    end: number;
  };
  months: Month[];
  seasons: Season[];
  metrics: MetricType[];
  comparisonMode: boolean;
  viewMode: 'table' | 'charts' | 'map';
}

export type TimeGranularity = 'monthly' | 'seasonal' | 'annual';

export interface TimeFilter {
  granularity: TimeGranularity;
  months?: Month[];
  seasons?: Season[];
}

// ============================================
// CHART DATA FORMATS
// ============================================

export interface TimeSeriesDataPoint {
  date: string; // ISO format or year
  value: number;
  region?: string;
  metric?: string;
}

export interface ComparisonDataPoint {
  category: string; // Region name or time period
  [key: string]: string | number; // Dynamic metric values
}

export interface HeatmapDataPoint {
  year: number;
  month: Month;
  value: number;
}

export interface RadarChartDataPoint {
  metric: string;
  value: number;
  fullMark: number;
}

// ============================================
// TABLE DATA FORMATS
// ============================================

export interface TableRow {
  id: string;
  [key: string]: string | number | boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable: boolean;
  type: 'string' | 'number' | 'date';
  unit?: string;
  format?: (value: unknown) => string;
}

// ============================================
// MAP DATA FORMATS
// ============================================

export interface MapRegionData {
  region: UKRegion;
  value: number;
  color: string;
  label: string;
}

export interface MapTooltipData {
  region: string;
  metric: string;
  value: number;
  unit: string;
  rank?: number;
}

// ============================================
// API RESPONSE TYPES (for future backend)
// ============================================

export interface WeatherDataAPIResponse {
  success: boolean;
  data: AnnualWeatherData[];
  meta: {
    totalRecords: number;
    regions: UKRegion[];
    yearRange: {
      min: number;
      max: number;
    };
  };
}

export interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// ============================================
// STATISTICS & AGGREGATIONS
// ============================================

export interface MetricStatistics {
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
}

export interface RegionalStatistics {
  region: UKRegion;
  metric: MetricType;
  statistics: MetricStatistics;
  trend: 'increasing' | 'decreasing' | 'stable';
  trendPercentage: number;
}

// ============================================
// EXPORT TYPES
// ============================================

export interface ExportOptions {
  format: 'csv' | 'json' | 'excel';
  includeMetadata: boolean;
  filename: string;
}

export interface ExportData {
  data: TableRow[] | AnnualWeatherData[];
  metadata: {
    exportDate: string;
    filters: Partial<FilterState>;
    recordCount: number;
  };
}
