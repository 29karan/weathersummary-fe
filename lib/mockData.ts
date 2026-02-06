// Legacy mock data - kept for backward compatibility
// For new dashboard features, use mockWeatherData.ts instead

// Simple regional data for basic examples
export const mockRegionalData = [
  {
    regionId: 'london',
    regionName: 'London',
    temperature: { min: 8, max: 18, mean: 13, unit: 'celsius' },
    rainfall: { total: 650, average: 54, unit: 'mm' },
    frozenDays: 12,
    coordinates: [-0.1276, 51.5074],
  },
  {
    regionId: 'manchester',
    regionName: 'Manchester',
    temperature: { min: 6, max: 16, mean: 11, unit: 'celsius' },
    rainfall: { total: 850, average: 71, unit: 'mm' },
    frozenDays: 18,
    coordinates: [-2.2426, 53.4808],
  },
  {
    regionId: 'birmingham',
    regionName: 'Birmingham',
    temperature: { min: 7, max: 17, mean: 12, unit: 'celsius' },
    rainfall: { total: 720, average: 60, unit: 'mm' },
    frozenDays: 15,
    coordinates: [-1.8904, 52.4862],
  },
  {
    regionId: 'edinburgh',
    regionName: 'Edinburgh',
    temperature: { min: 4, max: 14, mean: 9, unit: 'celsius' },
    rainfall: { total: 780, average: 65, unit: 'mm' },
    frozenDays: 25,
    coordinates: [-3.1883, 55.9533],
  },
  {
    regionId: 'cardiff',
    regionName: 'Cardiff',
    temperature: { min: 8, max: 17, mean: 12.5, unit: 'celsius' },
    rainfall: { total: 1100, average: 92, unit: 'mm' },
    frozenDays: 10,
    coordinates: [-3.1791, 51.4816],
  },
];

export const mockTemperatureChartData = [
  { month: 'Jan', min: 2, max: 8, mean: 5 },
  { month: 'Feb', min: 2, max: 9, mean: 5.5 },
  { month: 'Mar', min: 4, max: 12, mean: 8 },
  { month: 'Apr', min: 6, max: 15, mean: 10.5 },
  { month: 'May', min: 9, max: 18, mean: 13.5 },
  { month: 'Jun', min: 12, max: 21, mean: 16.5 },
  { month: 'Jul', min: 14, max: 23, mean: 18.5 },
  { month: 'Aug', min: 14, max: 23, mean: 18.5 },
  { month: 'Sep', min: 11, max: 19, mean: 15 },
  { month: 'Oct', min: 8, max: 15, mean: 11.5 },
  { month: 'Nov', min: 5, max: 11, mean: 8 },
  { month: 'Dec', min: 3, max: 8, mean: 5.5 },
];
