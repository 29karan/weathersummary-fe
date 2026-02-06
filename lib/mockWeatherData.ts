// Comprehensive mock weather data generator
// This generates realistic weather data for all UK regions
// Backend API will replace this later

import {
  AnnualWeatherData,
  UKRegion,
  MonthlyData,
  SeasonalData,
} from '@/types/weather';


// Simple seeded random number generator to ensure deterministic data
// This prevents hydration errors where server and client generate different data
let seed = 12345;
function seededRandom() {
  const a = 1664525;
  const c = 1013904223;
  const m = 4294967296;
  seed = (a * seed + c) % m;
  return seed / m;
}

// Helper function to generate realistic monthly data
function generateMonthlyData(
  baseValue: number,
  variation: number,
  monthlyPattern: number[]
): MonthlyData {
  return {
    jan: baseValue + monthlyPattern[0] * variation + (seededRandom() - 0.5) * variation * 0.2,
    feb: baseValue + monthlyPattern[1] * variation + (seededRandom() - 0.5) * variation * 0.2,
    mar: baseValue + monthlyPattern[2] * variation + (seededRandom() - 0.5) * variation * 0.2,
    apr: baseValue + monthlyPattern[3] * variation + (seededRandom() - 0.5) * variation * 0.2,
    may: baseValue + monthlyPattern[4] * variation + (seededRandom() - 0.5) * variation * 0.2,
    jun: baseValue + monthlyPattern[5] * variation + (seededRandom() - 0.5) * variation * 0.2,
    jul: baseValue + monthlyPattern[6] * variation + (seededRandom() - 0.5) * variation * 0.2,
    aug: baseValue + monthlyPattern[7] * variation + (seededRandom() - 0.5) * variation * 0.2,
    sep: baseValue + monthlyPattern[8] * variation + (seededRandom() - 0.5) * variation * 0.2,
    oct: baseValue + monthlyPattern[9] * variation + (seededRandom() - 0.5) * variation * 0.2,
    nov: baseValue + monthlyPattern[10] * variation + (seededRandom() - 0.5) * variation * 0.2,
    dec: baseValue + monthlyPattern[11] * variation + (seededRandom() - 0.5) * variation * 0.2,
  };
}

// Calculate seasonal and annual aggregates
function calculateAggregates(monthly: MonthlyData) {
  const seasonal: SeasonalData = {
    winter: (monthly.dec + monthly.jan + monthly.feb) / 3,
    spring: (monthly.mar + monthly.apr + monthly.may) / 3,
    summer: (monthly.jun + monthly.jul + monthly.aug) / 3,
    autumn: (monthly.sep + monthly.oct + monthly.nov) / 3,
  };

  const annual =
    (monthly.jan + monthly.feb + monthly.mar + monthly.apr +
     monthly.may + monthly.jun + monthly.jul + monthly.aug +
     monthly.sep + monthly.oct + monthly.nov + monthly.dec) / 12;

  return { ...monthly, ...seasonal, annual };
}

// Regional base values and patterns
const REGIONAL_PROFILES = {
  england_n: { tempBase: 9, rainfallBase: 850, sunshineBase: 1300 },
  england_s: { tempBase: 11, rainfallBase: 750, sunshineBase: 1600 },
  england_e_ne: { tempBase: 9.5, rainfallBase: 650, sunshineBase: 1450 },
  england_central: { tempBase: 10, rainfallBase: 700, sunshineBase: 1400 },
  england_sw_s_wales: { tempBase: 10.5, rainfallBase: 1100, sunshineBase: 1500 },
  midlands: { tempBase: 9.5, rainfallBase: 720, sunshineBase: 1350 },
  east_anglia: { tempBase: 10, rainfallBase: 600, sunshineBase: 1550 },
  scotland_n: { tempBase: 7, rainfallBase: 1200, sunshineBase: 1100 },
  scotland_e: { tempBase: 8, rainfallBase: 800, sunshineBase: 1250 },
  scotland_w: { tempBase: 8.5, rainfallBase: 1500, sunshineBase: 1150 },
  wales_n: { tempBase: 9, rainfallBase: 1300, sunshineBase: 1250 },
  wales: { tempBase: 9.5, rainfallBase: 1200, sunshineBase: 1300 },
  northern_ireland: { tempBase: 9, rainfallBase: 1000, sunshineBase: 1200 },
  uk: { tempBase: 9.5, rainfallBase: 900, sunshineBase: 1350 },
};

// Monthly patterns (normalized -1 to 1)
const TEMP_PATTERN = [-0.8, -0.7, -0.4, 0, 0.4, 0.8, 1, 0.9, 0.5, 0.1, -0.3, -0.7];
const RAINFALL_PATTERN = [0.2, 0.1, 0, -0.2, -0.3, -0.4, -0.3, -0.2, 0, 0.2, 0.3, 0.3];
const SUNSHINE_PATTERN = [-0.9, -0.7, -0.3, 0.2, 0.6, 0.9, 1, 0.9, 0.4, -0.1, -0.6, -0.9];

export function generateMockWeatherData(
  startYear: number = 2014,
  endYear: number = 2024
): AnnualWeatherData[] {
  const data: AnnualWeatherData[] = [];

  Object.keys(REGIONAL_PROFILES).forEach((regionKey) => {
    const region = regionKey as UKRegion;
    const profile = REGIONAL_PROFILES[region];

    for (let year = startYear; year <= endYear; year++) {
      // Add slight year-over-year variation (climate change trend)
      const yearTrend = (year - startYear) * 0.02;

      // Temperature (°C)
      const tempMin = generateMonthlyData(
        profile.tempBase - 3 + yearTrend,
        4,
        TEMP_PATTERN
      );
      const tempMax = generateMonthlyData(
        profile.tempBase + 5 + yearTrend,
        5,
        TEMP_PATTERN
      );
      const tempMean = generateMonthlyData(
        profile.tempBase + yearTrend,
        4.5,
        TEMP_PATTERN
      );

      // Frost days (count) - more in winter
      const frostPattern = [0.8, 0.7, 0.4, 0.1, 0, 0, 0, 0, 0, 0.1, 0.4, 0.7];
      const frostDays = generateMonthlyData(
        region.includes('scotland') ? 8 : 5,
        10,
        frostPattern
      );

      // Rainfall (mm)
      const rainfall = generateMonthlyData(
        profile.rainfallBase / 12,
        20,
        RAINFALL_PATTERN
      );

      // Rain days (count)
      const rainDays = generateMonthlyData(
        15,
        5,
        RAINFALL_PATTERN
      );

      // Sunshine (hours)
      const sunshine = generateMonthlyData(
        profile.sunshineBase / 12,
        80,
        SUNSHINE_PATTERN
      );

      data.push({
        year,
        region,
        temperature_min: calculateAggregates(tempMin),
        temperature_max: calculateAggregates(tempMax),
        temperature_mean: calculateAggregates(tempMean),
        frost_days: calculateAggregates(frostDays),
        rainfall: calculateAggregates(rainfall),
        rain_days: calculateAggregates(rainDays),
        sunshine: calculateAggregates(sunshine),
      });
    }
  });

  return data;
}

// Generate default dataset
export const MOCK_WEATHER_DATA = generateMockWeatherData();

// Helper to get data for specific region
export function getRegionData(region: UKRegion): AnnualWeatherData[] {
  return MOCK_WEATHER_DATA.filter((d) => d.region === region);
}

// Helper to get data for specific year
export function getYearData(year: number): AnnualWeatherData[] {
  return MOCK_WEATHER_DATA.filter((d) => d.year === year);
}

// Helper to get data for specific region and year range
export function getFilteredData(
  regions: UKRegion[],
  startYear: number,
  endYear: number
): AnnualWeatherData[] {
  return MOCK_WEATHER_DATA.filter(
    (d) => regions.includes(d.region) && d.year >= startYear && d.year <= endYear
  );
}
